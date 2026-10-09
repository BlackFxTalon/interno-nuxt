export function numericValue(value) {
  if (typeof value === 'number') {
    if (Number.isFinite(value) && value >= 0)
      return value
    throw new Error('Значение должно быть конечным неотрицательным числом.')
  }

  const normalized = String(value ?? '').replace(/\s/g, '').replace(',', '.')
  if (!/^\d+(?:\.\d+)?$/.test(normalized))
    throw new Error('Введите число, например 23450 или 1,6.')

  const number = Number(normalized)
  if (!Number.isFinite(number))
    throw new Error('Число слишком большое.')
  return number
}

export function recordToRows(value) {
  const record = value?.toJS ? value.toJS() : value
  if (record == null)
    return []
  if (typeof record !== 'object' || Array.isArray(record))
    throw new Error('Ожидается объект «размер → значение».')
  return Object.entries(record).map(([size, amount]) => ({ size, amount }))
}

export function rowsToRecord(rows) {
  const entries = []
  const sizes = new Set()
  for (const { size, amount } of rows) {
    const key = String(size).trim()
    if (!key)
      throw new Error('Заполните размер в каждой строке.')
    if (['__proto__', 'constructor', 'prototype'].includes(key))
      throw new Error('Недопустимый код размера.')
    if (sizes.has(key))
      throw new Error(`Размер «${key}» указан дважды.`)
    numericValue(amount)
    sizes.add(key)
    // Preserve existing number/string types, including decimal-comma weights.
    entries.push([key, amount])
  }
  return Object.fromEntries(entries)
}
