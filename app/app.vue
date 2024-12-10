<script lang="ts" setup>
useHead({
  titleTemplate: title => title ? `${title} – test` : 'Wish List – test',
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
  </div>
</template>
