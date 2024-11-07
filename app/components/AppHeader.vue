<script lang="ts" setup>
import type { HeaderLink } from '#ui-pro/types'

const { $csrfFetch } = useNuxtApp()

const { loggedIn, session, user } = useUserSession()

const title = useAppConfig().app.name;
const icon = useAppConfig().app.logo

const links: HeaderLink[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Tools',
    children: [
      { label: 'UTM Generator', to: 'utm-generator' },
      { label: 'Password Generator', to: 'password-generator' }
    ]
  }
]
</script>

<template>
  <UHeader
    :title
    :ui="{ logo: 'items-center' }"
  >
    <template #logo>
      <img
        class="h-6 w-6"
        :src="icon"
        aria-hidden
      >

      <span> {{ title }} </span>
    </template>

    <template #center>
      <UHeaderLinks :links="links" />
    </template>
  </UHeader>
</template>
