/**
 * Глобальные типы для Яндекс.СмартКапчи
 */

interface SmartCaptchaWidget {
  render: (container: HTMLElement, options: SmartCaptchaOptions) => string
  destroy: (widgetId: string) => void
}

interface SmartCaptchaOptions {
  sitekey: string
  hl?: string
  callback?: (token: string) => void
}

declare global {
  interface Window {
    smartCaptcha?: SmartCaptchaWidget
  }
}

export {}
