export function inputError(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export function textField(value, label, { required = false } = {}) {
  if (typeof value !== 'string') throw inputError(`${label} must be text.`);
  const text = value.trim();
  if (required && !text) throw inputError(`${label} is required.`);
  return text;
}

export function booleanField(value, fallback = true) {
  if (value === undefined) return fallback;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  throw inputError('Status must be true or false.');
}

export function orderField(value) {
  if (!['number', 'string'].includes(typeof value) || value === '') throw inputError('Order must be a non-negative integer.');
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) throw inputError('Order must be a non-negative integer.');
  return number;
}
