var test = require('node:test');
var assert = require('node:assert/strict');
var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

test('invoice figures match billed totals and GST breakdown', function () {
  var items = [{
    id: 1,
    name: 'Rice',
    sku: 'RICE-1',
    hsn: '1006',
    price: 100,
    qty: 6
  }];
  var billed = pricing.computeTotals(items, 'SAVE10');
  var figures = invoice.computeInvoiceFigures({ items: items, coupon: 'SAVE10' });

  assert.deepEqual({
    subtotal: figures.subtotal,
    discount: figures.discount,
    tax: figures.tax,
    cgst: figures.cgst,
    sgst: figures.sgst,
    total: figures.total,
    gstPercent: figures.rows[0].gstPercent,
    lineTax: figures.rows[0].lineTax
  }, {
    subtotal: billed.subtotal,
    discount: billed.discount,
    tax: billed.tax,
    cgst: billed.cgst,
    sgst: billed.sgst,
    total: billed.total,
    gstPercent: 5,
    lineTax: 27
  });
});

test('invoice mismatch banner is absent when invoice matches recorded order total', function () {
  var html = invoice.render({
    id: 1001,
    date: '21/11/2026',
    status: 'completed',
    customer: 'Test Customer',
    paymentMode: 'cash',
    coupon: 'SAVE10',
    items: [{ name: 'Rice', hsn: '1006', price: 100, qty: 6 }],
    total: 567
  });

  assert.doesNotMatch(html, /Accountant Reconciliation Notice/);
});
