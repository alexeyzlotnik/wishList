<script lang="ts" setup>
const route = useRoute()
const param = route.params.id as string
const uuid = param
const wishlist = ref(null)
const selectedItem = ref(null)

onMounted(async () => {
  try {
    const response = await $fetch(`/api/public/wishlists/${uuid}`)
    console.log('Fetched wishlist:', response) // Debug log
    wishlist.value = response
  } catch (error) {
    console.error(error)
    showError({ statusCode: 404, message: 'Wishlist not found' })
  }
})

const bookItem = async (item) => {
  // TODO: Implement booking logic
  selectedItem.value = item
}
</script>

<template>
  <UContainer>
    <UPage>
      <template v-if="wishlist">
        <UPageHeader :title="wishlist.name" :description="wishlist.description" />

        <UPageBody>
          <UAlert
            title="This wishlist was shared with you"
            description="Please select one item from the list below that you'd like to get for the recipient."
            color="primary"
          />

          <div class="space-y-6">
            <p class="text-gray-600">
              {{ wishlist.description }}
            </p>

            <!-- Wishlist Items Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="item in wishlist.items"
                :key="item.id"
                class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 class="font-semibold text-lg">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-gray-700">{{ item.price }}</span>
                  <UButton
                    :disabled="selectedItem"
                    :color="selectedItem === item ? 'success' : 'primary'"
                    @click="bookItem(item)"
                  >
                    {{ selectedItem === item ? 'Selected' : 'Select this item' }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UPageBody>
      </template>
    </UPage>
  </UContainer>
</template>
