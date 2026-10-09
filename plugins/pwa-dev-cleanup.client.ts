export default defineNuxtPlugin(() => {
  if (!import.meta.dev || !('serviceWorker' in navigator))
    return

  navigator.serviceWorker.getRegistrations()
    .then((registrations) => {
      return Promise.all(registrations.map(registration => registration.unregister()))
    })
    .catch((error) => {
      console.warn('[pwa-dev-cleanup] Failed to unregister service workers', error)
    })

  if ('caches' in window) {
    caches.keys()
      .then((keys) => {
        return Promise.all(keys.map(key => caches.delete(key)))
      })
      .catch((error) => {
        console.warn('[pwa-dev-cleanup] Failed to clear caches', error)
      })
  }
})
