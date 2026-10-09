let loading: Promise<void> | undefined

/** Load the third-party script only after a user opts into submitting a form. */
export function loadSmartCaptcha(): Promise<void> {
  if (window.smartCaptcha)
    return Promise.resolve()
  if (loading)
    return loading

  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'interno-smartcaptcha-script'
    script.src = 'https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload'
    script.async = true
    script.referrerPolicy = 'no-referrer'
    const timer = window.setTimeout(() => {
      script.remove()
      loading = undefined
      reject(new Error('SmartCaptcha load timeout'))
    }, 15000)
    script.onload = () => {
      window.clearTimeout(timer)
      if (window.smartCaptcha) {
        resolve()
      }
      else {
        script.remove()
        loading = undefined
        reject(new Error('SmartCaptcha is unavailable'))
      }
    }
    script.onerror = () => {
      window.clearTimeout(timer)
      script.remove()
      loading = undefined
      reject(new Error('SmartCaptcha load failed'))
    }
    document.head.append(script)
  })
  return loading
}
