export function formatCurrencyBR(value: string) {
  const digits = value.replace(/\D/g, "");
  const number = Number(digits) / 100;

  if (!digits) return "";

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseCurrencyBR(value: string) {
  if (!value) return 0;

  return Number(
    value
      .replace(/\./g, "")
      .replace(",", ".")
      .replace("R$", "")
      .trim()
  );
}

export function parseDecimalBR(value: string) {
  if (!value) return 0;
  return Number(value.replace(",", "."));
}
