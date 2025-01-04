export const useSuccessToast = (title: string, description?: string, actions?: any) => {
  const toast = useToast()

  toast.add({
    title,
    description,
    color: 'green',
    icon: 'i-heroicons-check-circle',
    actions: actions,
  })
}

export const useErrorToast = (title: string, description?: string) => {
  const toast = useToast()

  toast.add({
    title,
    description,
    color: 'red',
    icon: 'i-heroicons-x-circle',
  })
}
