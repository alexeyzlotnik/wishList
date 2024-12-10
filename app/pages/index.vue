<script lang="ts" setup>
const description = 'test'

useSeoMeta({
  title: 'Wish List',
  description,
})

const openWishlist = () => {
  navigateTo('/wishlists')
}
</script>

<template>
  <div>
    <ULandingSection
      title="Wish list"
      description="Wish list"
      headline="Wish list"
    >
    </ULandingSection>

    <div class="flex justify-center">
      <UButton @click="openWishlist" align="center">
        Create wish list online
      </UButton>
    </div>
  </div>
</template>
