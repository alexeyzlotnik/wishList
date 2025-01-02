<script lang="ts" setup>
const props = defineProps<{
  wishlistId: number
}>()

const { $csrfFetch } = useNuxtApp()
const { csrf } = useCsrf()

const isLoading = ref(false)
const state = ref({
  name: '',
  description: '',
  url: '',
  price: '',
  image: null as File | null
})

const onSubmit = async () => {
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', state.value.name)
    formData.append('description', state.value.description || '')
    formData.append('url', state.value.url || '')
    formData.append('price', state.value.price || '')
    if (state.value.image) {
      formData.append('image', state.value.image)
    }

    await $csrfFetch(`/api/wishlist/${props.wishlistId}/items`, {
      method: 'POST',
      body: formData,
    })

    // Reset form
    state.value = {
      name: '',
      description: '',
      url: '',
      price: '',
      image: null
    }

    useSuccessToast('Item added successfully')
    emit('added')
  } catch (error) {
    console.error(error)
    useErrorToast('Failed to add item')
  } finally {
    isLoading.value = false
  }
}

async function handleImageUpload(event: FileList) {
  const file = event[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await $csrfFetch('/api/files/files', {
      headers: {
        'csrf-token': csrf.value
      },
      method: 'POST',
      body: formData
    })

    console.log('Upload response:', response) // Debug log

    // Store the full URL path
    state.value.image = response.url
  } catch (err) {
    console.error('Upload error:', err)
    useErrorToast('Failed to upload image', err.data?.message)
  }
}

const emit = defineEmits(['added'])
</script>

<template>
  <UCard>
    <UForm :state="state" @submit="onSubmit">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" required />
      </UFormGroup>

      <UFormGroup label="Description" name="description">
        <UTextarea v-model="state.description" />
      </UFormGroup>

      <UFormGroup label="URL to buy" name="url">
        <UInput v-model="state.url" type="url" />
      </UFormGroup>

      <UFormGroup label="Price" name="price">
        <UInput v-model="state.price" />
      </UFormGroup>

      <UFormGroup label="Image" name="image">
        <UInput type="file" accept="image/*" icon="i-heroicons-folder" @change="handleImageUpload" />
      </UFormGroup>

      <div class="flex justify-end gap-3">
        <UButton
          color="primary"
          :loading="isLoading"
          type="submit"
        >
          Add Item
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
