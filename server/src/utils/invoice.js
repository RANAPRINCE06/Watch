const PDFDocument = require('pdfkit');

const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(24).text('CHRONO LUXURY', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text('Invoice', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(10);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${order.orderStatus}`);
    doc.moveDown();

    doc.text('Shipping Address:', { continued: false });
    const ship = order.shippingDetails || {};
    doc.text(`${ship.name}, ${ship.phone}`);
    doc.text(ship.email);
    doc.text(ship.address);
    doc.text(`${ship.city || ''} ${ship.state || ''} - ${ship.pincode}`);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    order.products.forEach((p) => {
      doc.text(`${p.name} x ${p.quantity} - ₹${(p.price * p.quantity).toFixed(2)}`);
    });
    doc.moveDown();
    if (order.subtotal) doc.text(`Subtotal: ₹${order.subtotal.toFixed(2)}`);
    if (order.discount) doc.text(`Discount: -₹${order.discount.toFixed(2)}`);
    if (order.gst) doc.text(`GST (18%): ₹${order.gst.toFixed(2)}`);
    doc.text(`Total: ₹${order.totalAmount.toFixed(2)}`, { underline: true });
    doc.moveDown();
    doc.text('Thank you for your purchase.', { align: 'center' });
    doc.end();
  });
};

module.exports = { generateInvoicePDF };
