export function useRenderEnv() {
  let isClient = false

  try {
    if ('window' in this) isClient = true
  } catch {
    isClient = false
  }

  return { isClient, isServer: !isClient }
}
