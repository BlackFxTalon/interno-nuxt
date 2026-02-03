/**
 * Composable для управления глобальным лоадером
 * Использует useState для реактивного состояния между компонентами
 */
export function useLoader() {
  const isLoading = useState('global-loader', () => false)

  /**
   * Показать лоадер
   */
  function showLoader() {
    isLoading.value = true
  }

  /**
   * Скрыть лоадер
   */
  function hideLoader() {
    isLoading.value = false
  }

  /**
   * Установить состояние лоадера
   * @param {boolean} value - Новое состояние
   */
  function setLoading(value) {
    isLoading.value = value
  }

  /**
   * Выполнить асинхронную функцию с автоматическим показом лоадера
   * @param {Function} asyncFn - Асинхронная функция для выполнения
   * @param {number} [minDelay] - Минимальная задержка в мс (для предотвращения мерцания)
   * @returns {Promise<any>} Результат выполнения функции
   */
  async function withLoader(asyncFn, minDelay = 0) {
    showLoader()
    const startTime = Date.now()

    try {
      const result = await asyncFn()

      // Если задан минимальный delay, ждем до его истечения
      if (minDelay > 0) {
        const elapsed = Date.now() - startTime
        const remaining = minDelay - elapsed
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining))
        }
      }

      return result
    }
    finally {
      hideLoader()
    }
  }

  return {
    isLoading,
    showLoader,
    hideLoader,
    setLoading,
    withLoader,
  }
}
