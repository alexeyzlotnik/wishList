<script lang="ts" setup>
import { drizzle } from 'drizzle-orm/d1';

definePageMeta({
  middleware: 'verified',
})

const title = 'Your wish lists'
let wishLists: any[] = []
const isOpen = ref(false)
const isLoading = ref(false)

const state = ref({
  name: '',
  description: ''
})

const { $csrfFetch } = useNuxtApp()
const { csrf } = useCsrf()

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
    wishLists = await getWishLists()
    closeModal()
    useSuccessToast('Wishlist created successfully')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to create wishlist')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  wishLists = await getWishLists()

  const db = hubDatabase()
  console.log(db)
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
        <UPageCard v-for="(wishlist, index) in wishLists" :key="index" v-bind="wishlist" />
      </UPageGrid>

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
