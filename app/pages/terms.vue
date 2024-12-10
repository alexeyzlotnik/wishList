<script lang="ts" setup>
const title = 'Terms of Service'

useSeoMeta({
  title: 'Terms of Service - Wish List',
  description: 'Our terms of service outline the rules and guidelines for using our platform.',
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        :title="title"
        class="mb-8"
      />

      <UPageBody class="prose max-w-none">
        <h2>1. Terms</h2>
        <p>By accessing our website, you agree to be bound by these terms of service and comply with all applicable laws and regulations.</p>

        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily use our platform for personal, non-commercial purposes only.</p>

        <h2>3. User Responsibilities</h2>
        <ul>
          <li>You must provide accurate information when creating an account</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You agree not to misuse or abuse our service</li>
        </ul>

        <h2>4. Limitations</h2>
        <p>We shall not be held liable for any damages that result from the use of our website.</p>

        <h2>5. Revisions and Errata</h2>
        <p>We reserve the right to update these terms of service at any time without notice.</p>

        <h2>6. Contact Information</h2>
        <p>Questions about the Terms of Service should be sent to us.</p>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
