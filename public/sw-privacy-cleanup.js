/* Remove legacy caches that must not retain API responses or remote fonts. */
globalThis.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(names => Promise.all(
    names
      .filter(name => name === 'interno-api' || name === 'google-fonts')
      .map(name => caches.delete(name)),
  )))
})
