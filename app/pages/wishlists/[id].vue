<script lang="ts" setup>
definePageMeta({
  middleware: 'verified',
})

const route = useRoute()
const { $csrfFetch } = useNuxtApp()
const { csrf } = useCsrf()

const urlForShare = computed(() => {
  if (!wishlist.value) return ''
  return `${useRequestURL().origin}/share/wishlist/${wishlist.value.uuid}`
})

import { useClipboard } from '@vueuse/core'
const { text, copy, copied, isSupported } = useClipboard({ urlForShare })

const id = route.params.id
const wishlist = ref(null)
const wishlistItems = ref(null)
const isPublic = ref(false)
const showAddItemForm = ref(false)
const showEditForm = ref(false)
const isEditing = ref(false)
const showNames = ref(false)

const breadcrumbLinks = computed(() => {
  if (!wishlist.value) return []
  return [{
    label: 'Wishlists',
    icon: 'i-heroicons-home',
    to: '/wishlists'
}, {
    label: wishlist.value?.name,
    icon: 'i-heroicons-link'
  }]
})

// fetch on mount
onMounted(async () => {
  await $csrfFetch(`/api/wishlist/${id}`, {
    headers: {
      'csrf-token': csrf
    }
  }).then(data => {
    console.log('data', data)
    wishlist.value = data.wishlists
    wishlistItems.value = data.wishlist_items
    isPublic.value = wishlist.value?.public ?? false
  }).catch(error => {
    console.error('Error fetching wishlist:', error)
  })
})

function shareUrl() {
  copy(urlForShare.value)
  useSuccessToast('Link copied to clipboard')
}

async function togglePublic() {
  try {
    const newPublicState = !isPublic.value
    console.log('Toggling public status:', { current: isPublic.value, new: newPublicState })

    const response = await $csrfFetch(`/api/wishlist/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ public: newPublicState }),
      headers: {
        'csrf-token': csrf,
        'Content-Type': 'application/json'
      }
    })

    console.log('Server response:', response)
    isPublic.value = response.public
    useSuccessToast(isPublic.value ? 'Wishlist is now public' : 'Wishlist is now private')
  } catch (error) {
    console.error('Toggle error:', error)
    useErrorToast('Failed to update wishlist visibility')
  }
}

const refreshWishlist = async () => {
  const data = await $csrfFetch(`/api/wishlist/${id}`, {
    headers: {
      'csrf-token': csrf
    }
  })
  wishlist.value = data.wishlists
  wishlistItems.value = data.wishlist_items
}

const onItemAdded = () => {
  showAddItemForm.value = false
  refreshWishlist()
}

async function editWishlist(formData: { name: string, description: string }) {
  isEditing.value = true
  try {
    await $csrfFetch(`/api/wishlist/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(formData),
      headers: {
        'csrf-token': csrf,
        'Content-Type': 'application/json'
      }
    })
    await refreshWishlist()
    showEditForm.value = false
    useSuccessToast('Wishlist updated successfully')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to update wishlist')
  } finally {
    isEditing.value = false
  }
}
</script>

<template>
  <UContainer>
    <UPage>
      <template v-if="wishlist">

        <UPageHeader :description="wishlist.description">

          <template #title>
            <UBreadcrumb :links="breadcrumbLinks" class="mb-4" />
            {{ wishlist.name }}
          </template>

          <template #links>
            <UButton
            icon="i-heroicons-pencil"
            variant="soft"
            @click="showEditForm = true"
          >
            Edit
          </UButton>

          <UModal v-model="showEditForm">
            <WishlistForm
              :initial-data="wishlist"
              :is-loading="isEditing"
              @submit="editWishlist"
              @cancel="showEditForm = false"
            />
          </UModal>
          </template>

        </UPageHeader>

        <UPageBody>

          <div class="flex gap-2 items-center justify-between mb-4">
            <UButton
              color="primary"
              @click="showAddItemForm = true"
            >
              Add New Item
            </UButton>
            <div class="flex gap-2 items-center">
              <!-- <UToggle v-model="isPublic" @change="togglePublic">
                {{ isPublic ? 'Public' : 'Private' }}
              </UToggle> -->
              <!-- show share url in a field -->
              <UInput v-model="urlForShare" readonly />
              <UButton
                icon="i-heroicons-share"
                @click="shareUrl()"
              >
                Copy Share URL
              </UButton>
            </div>
          </div>
          <div class="flex gap-2 items-center justify-end mb-4">
            <label for="showNames">Show who selected the item</label>
            <UToggle
              on-icon="i-heroicons-check-20-solid"
              off-icon="i-heroicons-x-mark-20-solid"
              v-model="showNames"
              name="showNames"
            />
          </div>

          <UModal v-model="showAddItemForm">
            <WishlistItemForm
              :wishlist-id="wishlist.id"
              @added="onItemAdded"
            />
          </UModal>

          <!-- Items Grid -->
          <div v-if="wishlistItems?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard
              v-for="item in wishlistItems"
              :key="item.id"
              class="flex flex-col"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-48 object-cover rounded-t-md"
              />
              <div class="flex flex-col flex-grow">
                <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm mt-2">{{ item.description }}</p>
                <div class="mt-4 flex items-start gap-3 flex-col">
                  <span class="text-gray-700">{{ item.price }}</span>
                  <UButton
                    v-if="item.url"
                    color="gray"
                    variant="soft"
                    class="w-full"
                    :to="item.url"
                    target="_blank"
                  >
                    View Item <UIcon name="i-heroicons-arrow-top-right-on-square" class="ml-1" />
                  </UButton>

                  <div v-if="item.selectedBy" class="bg-primary-100 text-sm p-2 rounded-md">
                    <template v-if="showNames && item.selectedBy">
                      {{ 'Selected by: ' + item.selectedBy }}
                    </template>
                    <template v-else>
                      {{ 'Selected by: ****' }}
                    </template>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
          <UAlert
            v-else
            title="No items yet"
          >
            Add items to your wishlist by clicking the "Add Item" button.
          </UAlert>
        </UPageBody>
      </template>
    </UPage>
  </UContainer>
</template>
