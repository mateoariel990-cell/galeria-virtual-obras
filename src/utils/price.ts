const onlyDigits = (value: string | number) => String(value).replace(/\D/g, '')

export const formatPriceInput = (value: string | number) => {
  const digits = onlyDigits(value)
  if (!digits) return ''

  return new Intl.NumberFormat('es-PY').format(Number(digits))
}

export const parsePriceInput = (value: string | number) => {
  const digits = onlyDigits(value)
  return digits ? Number(digits) : 0
}

export const formatGuarani = (value: number) =>
  new Intl.NumberFormat('es-PY').format(value)

export const formatPrice = (value: number) => `Gs. ${formatGuarani(value)}`