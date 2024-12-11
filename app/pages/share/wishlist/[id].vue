<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'

const { $csrfFetch } = useNuxtApp()

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

const isItemSelected = (itemId: number) => {
  return wishlist.value?.items.some(item => item.selectedBy)
}

const canUnselectItem = (itemId: number) => {
  return userSelections.value?.selections.includes(itemId)
}

const isCurrentUserSelection = (item) => {
  // Double check both server state and local storage
  return item.selectedBy && item.selectedBy === userSelections.value.name
}

const confirmSelection = async () => {
  try {
    await $csrfFetch(`/api/public/wishlists/${uuid}/select`, {
      method: 'POST',
      body: {
        itemId: selectedItem.value.id,
        userName: userName.value,
        action: 'select'
      }
    })

    userSelections.value = {
      name: userName.value,
      selections: [selectedItem.value.id] // Allow only one selection
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
    await $csrfFetch(`/api/public/wishlists/${uuid}/select`, {
      method: 'POST',
      body: {
        itemId: item.id,
        userName: userSelections.value.name,
        action: 'unselect'
      }
    })

    userSelections.value.selections = []

    await fetchWishlist()
    useSuccessToast('Item unselected successfully')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to unselect item')
  }
}
</script>

<template>
  <UContainer>
    <UPage>
      <template v-if="wishlist">
        <UPageHeader :title="wishlist.name" :description="wishlist.description" />

        <UPageBody>
          <UAlert
            :title="`This wishlist was shared with you`"
            description="Please select one item from the list below that you'd like to get for the recipient."
            color="primary"
            class="mb-4 bg-primary-400 text-dark"
          />

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="item in wishlist.items"
                :key="item.id"
                class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                :class="{ 'bg-primary-400': isCurrentUserSelection(item) }"
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
                    <UButton
                      v-if="isCurrentUserSelection(item)"
                      color="red"
                      variant="soft"
                      @click="unselectItem(item)"
                    >
                      Unselect
                    </UButton>
                    <UButton
                      v-else
                      disabled
                      color="gray"
                    >
                      Already Selected
                    </UButton>
                  </template>
                  <UButton
                    v-else
                    color="primary"
                    :disabled="userSelections?.selections.length > 0"
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

    <UModal v-model="showNameModal">
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
