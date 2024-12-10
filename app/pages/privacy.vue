<script lang="ts" setup>
const title = 'Privacy Policy'

useSeoMeta({
  title: 'Privacy Policy - Wish List',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
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
        <h2>Introduction</h2>
        <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our Wishlist platform.</p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Account information (name, email)</li>
          <li>Authentication data from third-party providers</li>
          <li>Wishlist content and preferences</li>
          <li>Usage data and analytics</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To provide customer support</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>

        <h2>Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

        <h2>Third-Party Services</h2>
        <p>We may use third-party services that collect, monitor and analyze data to help us improve our service.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
