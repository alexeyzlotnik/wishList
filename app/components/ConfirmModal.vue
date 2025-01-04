<script setup>
import { useConfirmDialog } from '@vueuse/core'
// TODO: create and use a confirm dialog
// https://vueuse.org/core/useConfirmDialog/#useconfirmdialog
const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel }
  = useConfirmDialog()

const props = defineProps({
  title: String,
  message: String,
  show: Boolean,
})

const show = computed(() => props.show)
</script>

<template>
  <teleport to="body">
    <UModal v-model="show">
      <div class="modal-bg">
        <div class="modal">
          <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <button @click="confirm">
          Yes
        </button>
        <button @click="cancel">
            Cancel
          </button>
        </div>
      </div>
    </UModal>
  </teleport>
</template>
