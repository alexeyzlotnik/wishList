<script lang="ts" setup>
definePageMeta({
  layout: 'centered',
  middleware: 'guest',
})

const title = 'Register to create your first wishlist'
const description = 'Use one of the following providers to register for an account.'

useSeoMeta({
  title,
  description,
})
</script>

<template>
<div class="flex flex-col gap-10">
  <UCard>
    <AuthForm :title :description class="w-full max-w-full">
      By signing in, you agree to our <NuxtLink to="/terms" class="text-primary font-medium">
        Terms of Service
      </NuxtLink>.
    </AuthForm>
  </UCard>

  <!-- How It Works Section -->
  <div>
    <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
    <div class="max-w-3xl mx-auto space-y-12">
      <div class="flex items-center gap-8">
        <div class="flex-1">
          <h3 class="text-2xl font-semibold mb-4">1. Create Your Wishlist</h3>
          <p class="text-gray-600">Sign up and create your first wishlist. Add items with details like name,
            description, price, and links.</p>
        </div>
      </div>
      <div class="flex items-center gap-8">
        <div class="flex-1">
          <h3 class="text-2xl font-semibold mb-4">2. Share with Friends</h3>
          <p class="text-gray-600">Share your wishlist using a unique link. Only people with the link can see your
            wishlist.</p>
        </div>
      </div>
      <div class="flex items-center gap-8">
        <div class="flex-1">
          <h3 class="text-2xl font-semibold mb-4">3. Prevent Double Gifts</h3>
          <p class="text-gray-600">When someone selects an item, it's marked as taken, preventing duplicate gifts.</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
