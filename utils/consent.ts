export const CONSENT_VERSION = '2026-10-09-v1'
export const CONSENT_DOCUMENT_PATH = `/consent/${CONSENT_VERSION}`

export const inquiryFormIds = ['inquiry', 'order', 'mattress', 'offer'] as const
export type InquiryFormId = typeof inquiryFormIds[number]
