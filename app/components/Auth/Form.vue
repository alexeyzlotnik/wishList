<script lang="ts" setup>
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <UAuthForm
    :title
    :description
    align="bottom"
    :providers="[
      { label: 'Google', icon: 'i-simple-icons-google', color: 'gray', external: true, to: '/auth/google' },
    ]"
  >
    <template #footer>
      <slot />
    </template>
  </UAuthForm>
</template>
