<script lang="ts" setup>

const appConfig = useAppConfig()
const title = appConfig.app.name
const smallLinks = appConfig.footer.smallLinks
const socials = appConfig.socials
const currentYear = new Date().getFullYear()
</script>

<template>
  <UFooter
    :links="smallLinks"
    :ui="{ bottom: { left: 'text-sm text-gray-600 dark:text-gray-300' } }"
  >
    <template #left>
      {{ title }} - {{ currentYear }}
    </template>

    <template #right>
      <UButton
        v-for="social in socials"
        :key="social.title"
        square
        color="gray"
        variant="ghost"
        v-bind="social"
      >
        {{ social.title }}
      </UButton>
    </template>
  </UFooter>
</template>
