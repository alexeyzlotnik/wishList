<script lang="ts" setup>
const props = defineProps<{
  initialData?: {
    name: string
    description?: string
  }
  isLoading?: boolean
}>()

const emit = defineEmits<{
  submit: [{ name: string, description: string }]
  cancel: []
}>()

const form = ref({
  name: props.initialData?.name || '',
  description: props.initialData?.description || ''
})

const onSubmit = () => {
  emit('submit', {
    name: form.value.name,
    description: form.value.description
  })
}
</script>

<template>
   <UCard>
      <UForm @submit.prevent="onSubmit" class="space-y-4">
         <UFormGroup label="Name" required>
            <UInput v-model="form.name" required />
         </UFormGroup>

         <UFormGroup label="Description">
            <UTextarea v-model="form.description" />
         </UFormGroup>

         <div class="flex justify-end gap-2">
            <UButton
            variant="soft"
            color="gray"
            @click="emit('cancel')"
            >
            Cancel
            </UButton>
            <UButton
            type="submit"
            color="primary"
            :loading="isLoading"
            >
            Save
            </UButton>
         </div>
      </UForm>
   </UCard>
</template>