import jsPDF from 'jspdf';
import { Order } from '@/lib/firebase/store';

export function generateInvoicePDF(order: Order, customerDetails: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Company Info
  doc.setFontSize(12);
  doc.text('Tari Electra', 20, yPosition);
  yPosition += 8;
  doc.text('Ramcocot, South C', 20, yPosition);
  yPosition += 8;
  doc.text('Phone: 0717777668', 20, yPosition);
  yPosition += 8;
  doc.text('Email: hello@tari.africa', 20, yPosition);
  yPosition += 20;

  // Order Details
  doc.setFont('helvetica', 'bold');
  doc.text(`Order Number: ${order.orderNumber}`, 20, yPosition);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - 60, yPosition);
  yPosition += 15;

  // Customer Details
  doc.text('Bill To:', 20, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(customerDetails.name || 'Customer', 20, yPosition);
  yPosition += 6;
  doc.text(customerDetails.email || order.customerEmail, 20, yPosition);
  yPosition += 20;

  // Items Table Header
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, yPosition);
  doc.text('Qty', 120, yPosition);
  doc.text('Price', 140, yPosition);
  doc.text('Total', 170, yPosition);
  yPosition += 10;

  // Items
  doc.setFont('helvetica', 'normal');
  order.items.forEach(item => {
    doc.text(item.name, 20, yPosition);
    doc.text(item.quantity.toString(), 120, yPosition);
    doc.text(`KES ${item.price}`, 140, yPosition);
    doc.text(`KES ${item.price * item.quantity}`, 170, yPosition);
    yPosition += 8;
  });

  // Total
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: KES ${order.total}`, 170, yPosition);

  return doc;
}