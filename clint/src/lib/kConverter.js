const kConverter = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
};

export default kConverter;
