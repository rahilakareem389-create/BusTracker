exports.generateBookingId = () => {
  return 'BK' + Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

exports.formatCurrency = (amount) => {
  return `₨ ${amount.toLocaleString()}`;
};