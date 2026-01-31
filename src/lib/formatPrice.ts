/**
 * Utility function untuk format harga
 * - Jika desimal .00, tampilkan tanpa desimal (contoh: 60.00 → "60")
 * - Jika desimal bukan .00, tampilkan dengan koma (contoh: 60.12 → "60,12")
 */
export function formatPrice(price: string | number): {
    whole: string;
    decimal: string;
    showDecimal: boolean;
    formatted: string;
} {
    const priceNum = typeof price === "string" ? parseFloat(price) : price;
    const priceFormatted = priceNum.toFixed(2);
    const [whole, decimal] = priceFormatted.split(".");
    const showDecimal = decimal !== "00";

    return {
        whole,
        decimal,
        showDecimal,
        formatted: showDecimal ? `${whole},${decimal}` : whole,
    };
}
