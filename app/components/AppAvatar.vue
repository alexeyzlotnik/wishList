<script lang="ts" setup>
const props = defineProps<{
  src: string | null
  text: string
  size: string | undefined
}>()

const src = computed(() => {
  if (!props.src) {
    return
  }

  if (props.src.startsWith('http') || props.src.startsWith('data')) {
    return props.src
  }

  // Prefix the image path with the images folder
  return `images/${props.src}`
})

</script>

<template>
  <UAvatar :src :size="size" />
  {{ text }}
</template>
