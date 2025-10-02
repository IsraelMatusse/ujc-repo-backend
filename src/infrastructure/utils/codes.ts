export function generateAleatoryCodes(): string {
  const year = new Date().getFullYear().toString().slice(-4);
  const objectIdPart = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const randomPart = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `${year}${objectIdPart}${randomPart}`;
}
