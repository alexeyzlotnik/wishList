<script lang="ts" setup>
import type { FetchError } from 'ofetch'

const { user } = useUserSession()

console.log(user.value)

const isGoogleConnected = computed(() => Boolean(user.value?.googleId))

const { $csrfFetch } = useNuxtApp()
const { fetch: fetchUserSession } = useUserSession()

async function disconnect(providerName: 'google') {
  try {
    await $csrfFetch(`/api/me/providers/${providerName}`, {
      method: 'DELETE',
    })

    await fetchUserSession()

    useSuccessToast(`Disconnected from ${providerName}`)
  }
  catch (error) {
    console.error(error)
    useErrorToast('An error occurred while disconnecting from the provider', (error as FetchError).data.message)
  }
}
</script>

<template>
  <ProfileSection
    title="Authentication"
    description="Access to your account using another provider."
  >
    <UCard class="grow">
      <p>
        Link one or more of the following providers to your account to access it using them.
      </p>

      <div class="flex flex-row gap-4 mt-4">
        <UButton
          color="gray"
          :to="isGoogleConnected ? undefined : '/auth/google'"
          external
          icon="i-simple-icons-google"
          @click="isGoogleConnected ? disconnect('google') : undefined"
        >
          {{ user?.googleId ? 'Remove connection' : 'Connect Google' }}
        </UButton>
      </div>
    </ucard>
  </ProfileSection>
</template>
