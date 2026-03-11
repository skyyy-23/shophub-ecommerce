const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : Number(value);
  return formatter.format(Number.isFinite(parsed) ? parsed : 0);
};
