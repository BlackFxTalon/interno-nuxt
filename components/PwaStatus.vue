<script setup>
const { $pwa } = useNuxtApp()

function refreshApp() {
  $pwa.updateServiceWorker()
}

function dismissUpdate() {
  if ($pwa?.cancelPrompt) {
    $pwa.cancelPrompt()
    return
  }
  if ($pwa?.needRefresh && typeof $pwa.needRefresh === 'object' && 'value' in $pwa.needRefresh) {
    $pwa.needRefresh.value = false
  }
}

function installApp() {
  $pwa.install()
}

function dismissInstall() {
  if ($pwa.cancelInstall) {
    $pwa.cancelInstall()
    return
  }
  if ($pwa.showInstallPrompt && typeof $pwa.showInstallPrompt === 'object' && 'value' in $pwa.showInstallPrompt) {
    $pwa.showInstallPrompt.value = false
  }
}
</script>

<template>
  <ClientOnly>
    <div
      v-if="$pwa && $pwa.needRefresh"
      class="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
    >
      <div class="text-sm font-semibold text-gray-900">
        Доступно обновление
      </div>
      <div class="mt-1 text-xs text-gray-600">
        Перезагрузите приложение, чтобы применить новую версию.
      </div>
      <div class="mt-3 flex gap-2">
        <button
          class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white"
          type="button"
          @click="refreshApp"
        >
          Обновить
        </button>
        <button
          class="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700"
          type="button"
          @click="dismissUpdate"
        >
          Позже
        </button>
      </div>
    </div>

    <div
      v-if="$pwa && $pwa.showInstallPrompt"
      class="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
    >
      <div class="text-sm font-semibold text-gray-900">
        Установить приложение?
      </div>
      <div class="mt-1 text-xs text-gray-600">
        Будет доступно офлайн и запускаться как отдельное приложение.
      </div>
      <div class="mt-3 flex gap-2">
        <button
          class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white"
          type="button"
          @click="installApp"
        >
          Установить
        </button>
        <button
          class="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700"
          type="button"
          @click="dismissInstall"
        >
          Не сейчас
        </button>
      </div>
    </div>
  </ClientOnly>
</template>
