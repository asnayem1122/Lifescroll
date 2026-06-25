export function formatBDT(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  return `${sign}৳${abs.toLocaleString('en-IN')}`;
}

export function formatBDTFull(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  return `${sign}৳${abs.toLocaleString('en-IN')}`;
}
