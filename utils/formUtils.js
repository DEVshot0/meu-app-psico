// utils/formUtils.js
import { unMask } from 'react-native-mask-text';

export function formatDateForAPI(date) {
  if (!date) return '';
  const [d, m, y] = date.split('/');
  return `${y}-${m}-${d}`;
}

export function sanitizeCpfTel(obj) {
  return {
    ...obj,
    phone_number: unMask(obj.phone_number),
    cpf: unMask(obj.cpf)
  };
}
