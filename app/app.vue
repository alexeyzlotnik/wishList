<script lang="ts" setup>
useHead({
  titleTemplate: title => title ? `${title} – WishLister` : 'WishLister',
})

const { csrf } = useCsrf()

// Initialize CSRF token
onMounted(() => {
  csrf.value // This will trigger the token generation
})

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>
