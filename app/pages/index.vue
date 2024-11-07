<script lang="ts" setup>
const description = 'test'

useSeoMeta({
  title: 'Wish List',
  description,
})

const tools = [
  {
    icon: 'i-heroicons-key',
    title: 'Password Generator',
    description: 'Generate strong, secure passwords instantly. Customize length and character types to meet your security requirements.',
    to: '/password-generator'
  },
  {
    icon: 'i-heroicons-link',
    title: 'UTM Generator',
    description: 'Create and manage UTM parameters effortlessly. Perfect for tracking your marketing campaigns and analyzing traffic sources.',
    to: '/utm-generator'
  },
  {
    icon: 'i-heroicons-clock',
    title: 'Coming Soon',
    description: 'More tools coming soon'
  }
]
</script>

<template>
  <div>
    <ULandingSection
      title="Essential Tools for Developers and Marketers"
      description="Streamline your workflow with our free online tools. Generate secure passwords and build UTM tracking links in seconds."
      headline="Tools"
    >
      <ULandingGrid>
        <ULandingCard
          v-for="tool in tools"
          :key="tool.title"
          class="col-span-4 row-span-4"
          :icon="tool.icon"
          :title="tool.title"
          :description="tool.description"
          :to="tool.to"
        />
      </ULandingGrid>
    </ULandingSection>
  </div>
</template>
