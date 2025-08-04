import { Timestamp } from 'firebase/firestore';

export function toDate(dateValue: string | Timestamp | Date): Date {
  if (dateValue instanceof Date) {
    return dateValue;
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue);
  }
  if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
    return dateValue.toDate();
  }
  return new Date();
}

export function formatDate(dateValue: string | Timestamp | Date): string {
  const date = toDate(dateValue);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatDateISO(dateValue: string | Timestamp | Date): string {
  return toDate(dateValue).toISOString().split('T')[0];
}

export function formatDateTime(dateValue: string | Timestamp | Date): string {
  return toDate(dateValue).toLocaleString();
}