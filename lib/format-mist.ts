export function formatMist(mist?: bigint | number): string {
  if (mist === undefined || mist === null) return '-'

  const mistValue = typeof mist === 'bigint' ? mist : BigInt(mist)
  const suiValue = Number(mistValue) / 1_000_000_000
  return suiValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
