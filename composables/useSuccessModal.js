/**
 * Composable для управления глобальным модальным окном успеха
 * Использует useState для реактивного состояния между компонентами
 */
export function useSuccessModal() {
  const show = useState('successModal-show', () => false)
  const title = useState('successModal-title', () => 'Успешно!')
  const message = useState('successModal-message', () => 'Операция выполнена успешно.')

  /**
   * Показать модальное окно успеха
   * @param {object} options - Опции модального окна
   * @param {string} [options.title] - Заголовок модального окна
   * @param {string} [options.message] - Сообщение модального окна
   */
  function showSuccessModal(options = {}) {
    if (options.title) {
      title.value = options.title
    }
    if (options.message) {
      message.value = options.message
    }
    show.value = true
  }

  /**
   * Закрыть модальное окно успеха
   */
  function closeSuccessModal() {
    show.value = false
  }

  return {
    show,
    title,
    message,
    showSuccessModal,
    closeSuccessModal,
  }
}
