export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  INR: { symbol: '₹', rate: 83.5, label: 'INR (₹)' }
};

export const formatPrice = (amount, currencyCode = 'USD') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amount * currency.rate;
  
  if (currencyCode === 'INR') {
    return `${currency.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }
  
  return `${currency.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

export const calculateDiscount = (regularPrice, salePrice) => {
  if (!salePrice || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

export const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TB-${timestamp}-${random}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return String(dateString);
  }
};

export const formatCurrency = (amount, currencyCode = 'USD') => {
  return formatPrice(amount || 0, currencyCode);
};
