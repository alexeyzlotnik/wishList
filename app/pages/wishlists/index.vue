<script lang="ts" setup>
import { drizzle } from 'drizzle-orm/d1'

definePageMeta({
  middleware: 'verified',
})

const title = 'Your wish lists'
const wishLists = ref([])
const isOpen = ref(false)
const isLoading = ref(false)

const state = ref({
  name: '',
  description: ''
})

const { $csrfFetch } = useNuxtApp()
const { csrf } = useCsrf()

const isDeleteModalOpen = ref(false)
const wishlistToDelete = ref(null)
const isDeleting = ref(false)

const getWishLists = async () => {
  const response = await $csrfFetch('/api/wishlist/wishlists', {
    headers: {
      'csrf-token': csrf
    }
  })
  return response
}

const addWishlist = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  state.value = {
    name: '',
    description: ''
  }
}

const onSubmit = async () => {
  isLoading.value = true
  try {
    await $csrfFetch('/api/wishlist/wishlists', {
      method: 'POST',
      body: state.value,
      headers: {
        'csrf-token': csrf
      }
    })

    // Refresh wishlists after adding
    wishLists.value = await getWishLists()
    closeModal()
    useSuccessToast('Wishlist created successfully')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to create wishlist')
  } finally {
    isLoading.value = false
  }
}

const openDeleteModal = (wishlist: any) => {
  wishlistToDelete.value = wishlist
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  wishlistToDelete.value = null
  isDeleteModalOpen.value = false
}

const deleteWishlist = async () => {
  if (!wishlistToDelete.value) return

  isDeleting.value = true
  try {
    await $csrfFetch(`/api/wishlist/${wishlistToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }
    })

    // Refresh the wishlists after deletion
    wishLists.value = await getWishLists()
    closeDeleteModal()
    useSuccessToast('Wishlist deleted successfully')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to delete wishlist')
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  console.log('Fetching wishlists')
  wishLists.value = await getWishLists()
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader :title />

      <UButton @click="addWishlist" class="my-4">
        Add new wishlist
      </UButton>

      <UPageGrid class="my-4">
        <div v-for="wishlist in wishLists" :key="wishlist.id" class="relative">
          <UPageCard
            :to="`/wishlists/${wishlist.id}`"
          >
            <h2 class="text-xl font-semibold">{{ wishlist.name }}</h2>
            <p>{{ wishlist.description }}</p>
            <UButton
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              class="absolute top-2 right-2"
            @click.prevent="openDeleteModal(wishlist)"
            />
          </UPageCard>
        </div>
      </UPageGrid>

      <!-- Delete Confirmation Modal -->
      <UModal v-model="isDeleteModalOpen">
        <UCard :ui="{
          base: 'w-[500px]',
          header: { padding: 'p-4' },
          body: { padding: 'p-4' },
          footer: { padding: 'p-4' }
        }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold">
                Delete Wishlist
              </h3>
            </div>
          </template>

          <template #default>
            <p>Are you sure you want to delete "{{ wishlistToDelete?.name }}"? This action cannot be undone.</p>
          </template>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="gray"
                variant="soft"
                @click="closeDeleteModal"
              >
                Cancel
              </UButton>
              <UButton
                color="red"
                :loading="isDeleting"
                @click="deleteWishlist"
              >
                Delete Wishlist
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <!-- Existing Add Wishlist Modal -->
      <UModal v-model="isOpen">
        <UCard :ui="{
          base: 'w-[500px]',
          header: { padding: 'p-4' },
          body: { padding: 'p-4' },
          footer: { padding: 'p-4' }
        }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold">
                Create New Wishlist
              </h3>
            </div>
          </template>

          <template #default>
            <UForm :state="state" @submit="onSubmit">
              <UFormGroup label="Name" name="name">
                <UInput v-model="state.name" required />
              </UFormGroup>

              <UFormGroup label="Description" name="description">
                <UTextarea v-model="state.description" />
              </UFormGroup>
            </UForm>
          </template>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="gray" variant="soft" @click="closeModal">
                Cancel
              </UButton>
              <UButton
                color="primary"
                :loading="isLoading"
                @click="onSubmit"
              >
                Create Wishlist
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </UPage>
  </UContainer>
</template>
