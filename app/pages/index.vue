<script lang="ts" setup>
const description = 'Create and share your wishlists with friends and family. Perfect for birthdays, holidays, and special occasions.'

useSeoMeta({
  title: 'Wish List - Share Your Gift Ideas',
  description,
})

const features = [
  {
    title: 'Create Wishlists',
    description: 'Easily create and manage multiple wishlists for different occasions',
    icon: 'i-heroicons-gift'
  },
  {
    title: 'Share Securely',
    description: 'Share your wishlist with a unique link that only invited people can access',
    icon: 'i-heroicons-share'
  },
  {
    title: 'Prevent Duplicates',
    description: 'Items get marked as selected when someone chooses them, preventing duplicate gifts',
    icon: 'i-heroicons-check-circle'
  },
  {
    title: 'Keep Surprises',
    description: 'Gift givers remain anonymous to the wishlist owner',
    icon: 'i-heroicons-sparkles'
  }
]

const openWishlist = () => {
  navigateTo('/wishlists')
}
</script>

<template>
  <div>
    <ULandingSection
      title="Make Gift-Giving Easy"
      description="Create and share wishlists with your friends and family. Perfect for birthdays, holidays, and special occasions."
      headline="Your Ultimate Wishlist Platform"
      class="!gap-4"
    >
      <template #default>
        <div class="flex justify-center gap-4 mt-0">
          <UButton
            @click="openWishlist"
            color="primary"
            size="xl"
          >
            Create Your Wishlist
          </UButton>
          <!-- <UButton
            to="/about"
            color="gray"
            variant="soft"
            size="xl"
          >
            Learn More
          </UButton> -->
        </div>
      </template>
    </ULandingSection>

    <!-- Features Section -->
    <section class="py-24 bg-gray-50">
      <UContainer>
        <h2 class="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-6 bg-white rounded-lg shadow-sm"
          >
            <UIcon
              :name="feature.icon"
              class="w-12 h-12 text-primary-500 mb-4"
            />
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- How It Works Section -->
    <section class="py-24">
      <UContainer>
        <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div class="max-w-3xl mx-auto space-y-12">
          <div class="flex items-center gap-8">
            <div class="flex-1">
              <h3 class="text-2xl font-semibold mb-4">1. Create Your Wishlist</h3>
              <p class="text-gray-600">Sign up and create your first wishlist. Add items with details like name, description, price, and links.</p>
            </div>
          </div>
          <div class="flex items-center gap-8">
            <div class="flex-1">
              <h3 class="text-2xl font-semibold mb-4">2. Share with Friends</h3>
              <p class="text-gray-600">Share your wishlist using a unique link. Only people with the link can see your wishlist.</p>
            </div>
          </div>
          <div class="flex items-center gap-8">
            <div class="flex-1">
              <h3 class="text-2xl font-semibold mb-4">3. Prevent Double Gifts</h3>
              <p class="text-gray-600">When someone selects an item, it's marked as taken, preventing duplicate gifts.</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
