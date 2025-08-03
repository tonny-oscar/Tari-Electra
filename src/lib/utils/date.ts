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
  return toDate(dateValue).toLocaleDateString();
}

export function formatDateTime(dateValue: string | Timestamp | Date): string {
  return toDate(dateValue).toLocaleString();
}