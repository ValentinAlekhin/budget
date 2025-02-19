export function useNotify() {
  const toast = useToast()

  const error = (title: string) => toast.add({ title })
  const success = (title: string) => toast.add({ title })
  const warning = (title: string) => toast.add({ title })
  const info = (title: string) => toast.add({ title })

  return { error, success, warning, info }
}
