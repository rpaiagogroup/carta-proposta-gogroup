
export const formatCurrency = (value) => {
    if (!value) return '';
    // Remove non-digits
    const numericValue = value.toString().replace(/\D/g, '');

    if (numericValue === '') return '';

    // Convert to number / 100
    const number = parseFloat(numericValue) / 100;

    // Format as BRL
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }); // Returns "R$ 1.234,56"
};

export const parseCurrency = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;

    // "R$ 1.234,56" -> 1234.56
    const numericString = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numericString) || 0;
};
