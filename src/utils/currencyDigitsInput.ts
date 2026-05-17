/** Keep only digits — supports paste of values like `$1,250,000` */
export function stripToAmountDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Inserts commas every three digits from the right (digits-only string). */
export function formatThousandsFromDigits(digitString: string): string {
  if (!digitString) return "";
  return digitString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
