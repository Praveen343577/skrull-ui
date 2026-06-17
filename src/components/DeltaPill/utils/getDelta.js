export const getDelta = (currentStr, prevStr) => {
  const extractNumber = (str) => {
    if (!str) return null;
    const match = String(str).match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  };

  const curr = extractNumber(currentStr);
  const prev = extractNumber(prevStr);

  if (curr === null || prev === null) {
    return { value: '--', direction: 'none' };
  }
  
  const diff = curr - prev;
  if (diff === 0) {
    return { value: 0, direction: 'same' };
  }

  return {
    value: Math.abs(diff),
    direction: diff > 0 ? 'up' : 'down',
  };
};
