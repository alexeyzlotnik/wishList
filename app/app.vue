<script lang="ts" setup>
useHead({
  titleTemplate: title => title ? `${title} – test` : 'Wish List – test',
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
