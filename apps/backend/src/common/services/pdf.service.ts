import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class PdfService {
  generatePOPdf(poData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('PURCHASE ORDER', { align: 'center' });
      doc.moveDown();

      // PO Details
      doc.fontSize(12).font('Helvetica');
      doc.text(`PO Number: ${poData.poNumber}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Delivery Date: ${poData.deliveryDate.toLocaleDateString()}`);
      doc.moveDown();

      // Vendor Details
      doc.fontSize(14).font('Helvetica-Bold').text('Bill To:');
      doc.fontSize(12).font('Helvetica');
      doc.text(`${poData.vendorName}`);
      doc.text(`${poData.vendorEmail}`);
      doc.text(`${poData.vendorPhone}`);
      doc.moveDown();

      // Items Table
      doc.fontSize(12).font('Helvetica-Bold').text('Items:');
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const col1X = 50;
      const col2X = 250;
      const col3X = 350;
      const col4X = 450;

      doc.text('Product', col1X, tableTop, { width: 200 });
      doc.text('Qty', col2X, tableTop);
      doc.text('Unit Price', col3X, tableTop);
      doc.text('Total', col4X, tableTop);

      let y = tableTop + 20;
      poData.items.forEach((item: any) => {
        doc.fontSize(11).text(item.productName, col1X, y, { width: 200 });
        doc.text(item.quantity.toString(), col2X, y);
        doc.text(`₹${item.unitPrice.toFixed(2)}`, col3X, y);
        doc.text(`₹${item.total.toFixed(2)}`, col4X, y);
        y += 25;
      });

      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(`Total Amount: ₹${poData.finalAmount.toFixed(2)}`, 350);
      doc.text(`Tax: ₹${poData.taxAmount.toFixed(2)}`, 350);
      doc.text(`Final Amount: ₹${poData.finalAmount.toFixed(2)}`, 350);

      doc.end();
    });
  }

  generateInvoicePdf(invoiceData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
      doc.moveDown();

      // Invoice Details
      doc.fontSize(12).font('Helvetica');
      doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`);
      doc.text(`Invoice Date: ${invoiceData.invoiceDate.toLocaleDateString()}`);
      doc.text(`Due Date: ${invoiceData.dueDate.toLocaleDateString()}`);
      doc.moveDown();

      // Bill To
      doc.fontSize(14).font('Helvetica-Bold').text('Bill To:');
      doc.fontSize(12).font('Helvetica');
      doc.text(`${invoiceData.vendorName}`);
      doc.text(`${invoiceData.vendorEmail}`);
      doc.moveDown();

      // Items Table
      doc.fontSize(12).font('Helvetica-Bold').text('Items:');
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const col1X = 50;
      const col2X = 250;
      const col3X = 350;
      const col4X = 450;

      doc.text('Product', col1X, tableTop, { width: 200 });
      doc.text('Qty', col2X, tableTop);
      doc.text('Unit Price', col3X, tableTop);
      doc.text('Total', col4X, tableTop);

      let y = tableTop + 20;
      invoiceData.items.forEach((item: any) => {
        doc.fontSize(11).text(item.productName, col1X, y, { width: 200 });
        doc.text(item.quantity.toString(), col2X, y);
        doc.text(`₹${item.unitPrice.toFixed(2)}`, col3X, y);
        doc.text(`₹${item.total.toFixed(2)}`, col4X, y);
        y += 25;
      });

      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(`Subtotal: ₹${invoiceData.totalAmount.toFixed(2)}`, 350);
      doc.text(`Tax: ₹${invoiceData.taxAmount.toFixed(2)}`, 350);
      doc.text(`Total Amount Due: ₹${invoiceData.finalAmount.toFixed(2)}`, 350);

      doc.end();
    });
  }
}
