<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'

const { $csrfFetch, $csrf } = useNuxtApp()
const { csrf } = useCsrf()

const route = useRoute()
const uuid = route.params.id as string
const wishlist = ref(null)
const selectedItem = ref(null)
const showNameModal = ref(false)
const userName = ref('')

// Load user data from localStorage using VueUse
const storageKey = `wishlist-${uuid}-user`
const userSelections = useLocalStorage(storageKey, {
  name: '',
  selections: [] as number[]
})

// Set initial userName from storage
onMounted(() => {
  userName.value = userSelections.value.name
})

const fetchWishlist = async () => {
  try {
    const response = await $fetch(`/api/public/wishlists/${uuid}`)
    wishlist.value = response

    // Sync local storage with server state
    const userSelectedItems = wishlist.value.items
      .filter(item => item.selectedBy === userSelections.value.name)
      .map(item => item.id)

    // Update local storage to match server state
    userSelections.value = {
      name: userSelections.value.name,
      selections: userSelectedItems
    }
  } catch (error) {
    console.error(error)
    showError({ statusCode: 404, message: 'Wishlist not found' })
  }
}

// Initial fetch
onMounted(fetchWishlist)

const openNameModal = (item) => {
  if (userSelections.value.name) {
    userName.value = userSelections.value.name
  }
  selectedItem.value = item
  showNameModal.value = true
}

const isCurrentUserSelection = (item) => {
  // Double check both server state and local storage
  return item.selectedBy && item.selectedBy === userSelections.value.name
}

const confirmSelection = async () => {
  try {
    await $csrfFetch(`/api/public/wishlists/${route.params.id}/select`, {
      method: 'POST',
      headers: {
        'csrf-token': $csrf
      },
      body: {
        itemId: selectedItem.value.id,
        userName: userName.value,
        action: 'select'
      }
    })

    userSelections.value = {
      name: userName.value,
      selections: [...userSelections.value.selections, selectedItem.value.id]
    }

    showNameModal.value = false
    await fetchWishlist()
    useSuccessToast('Item selected successfully')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to select item')
  }
}

const unselectItem = async (item) => {
  if (!userSelections.value.name) {
    useErrorToast('You cannot unselect this item')
    return
  }

  try {
    await $csrfFetch(`/api/public/wishlists/${route.params.id}/select`, {
      method: 'POST',
      headers: {
        'csrf-token': $csrf
      },
      body: {
        itemId: item.id,
        userName: userSelections.value.name,
        action: 'unselect'
      }
    })

    userSelections.value.selections = userSelections.value.selections.filter(id => id !== item.id)

    await fetchWishlist()
    useSuccessToast('Item unselected successfully')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to unselect item')
  }
}

// Add meta tags after wishlist is loaded
watch(() => wishlist.value, (newWishlist) => {
  if (newWishlist) {
    useSeoMeta({
      title: () => `Check out ${newWishlist.name} wishlist`,
      description: "This wishlist was shared with you. Please select one item from the list below that you'd like to get for the recipient.",
      // Disable search engine indexing
      robots: 'noindex, nofollow',
      // Open Graph meta tags for social sharing
      ogTitle: () => `Check out ${newWishlist.name} wishlist`,
      ogDescription: "This wishlist was shared with you. Please select one item from the list below that you'd like to get for the recipient.",
      ogImage: null,
      // Twitter Card meta tags
      twitterTitle: () => `Check out ${newWishlist.name} wishlist`,
      twitterDescription: "This wishlist was shared with you. Please select one item from the list below that you'd like to get for the recipient.",
      twitterCard: 'summary',
      twitterImage: null,
    })
  }
})

definePageMeta({
  layout: 'public-wishlist',
  middleware: 'guest',
})
</script>

<template>
  <UContainer>
    <UPage>
      <template v-if="wishlist">
        <UPageHeader :title="wishlist.name" :description="wishlist.description"/>

        <UPageBody>
          <!-- TODO: fetch author name -->
          <UAlert
            :title="`This wishlist was shared with you by AUTHOR NAME HERE` "
            description="Please select one or more items from the list below that you'd like to get for the recipient."
            class="mb-4 bg-primary-100 text-dark lg:w-1/2"
          />

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="item in wishlist.items"
                :key="item.id"
                class="border rounded-lg p-4 hover:shadow-lg transition-shadow relative"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 class="font-semibold text-lg">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>

                <UButton
                  v-if="item.url"
                  color="gray"
                  variant="soft"
                  class="mb-4 w-full"
                  :to="item.url"
                  target="_blank"
                >
                  View Item <UIcon name="i-heroicons-arrow-top-right-on-square" class="ml-1" />
                </UButton>

                <div class="flex justify-between items-center mt-4">
                  <span class="text-gray-700">{{ item.price }}</span>
                  <template v-if="item.selectedBy">
                    <!-- unselect button -->
                    <UButton
                      v-if="isCurrentUserSelection(item)"
                      color="red"
                      variant="soft"
                      @click="unselectItem(item)"
                    >
                      Unselect
                    </UButton>
                    <!-- selected badge -->
                    <span class="absolute top-4 right-4 text-xs text-white bg-blue-400 rounded-full px-2 py-1">
                      Already selected
                    </span>
                  </template>
                  <!-- select button -->
                  <UButton
                    v-else
                    color="primary"
                    @click="openNameModal(item)"
                  >
                    Select this item
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UPageBody>
      </template>
    </UPage>

    <UModal
      v-model="showNameModal"
      :ui="{
        container: 'items-center'  // This centers the modal vertically
      }"
    >
      <UCard>
        <UForm @submit.prevent="confirmSelection">
          <UFormGroup label="Your Name" required>
            <UInput v-model="userName" required />
          </UFormGroup>
          <div class="flex justify-end gap-2 mt-4">
            <UButton variant="soft" color="gray" @click="showNameModal = false">
              Cancel
            </UButton>
            <UButton type="submit" color="primary">
              Confirm
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </UContainer>
</template>
