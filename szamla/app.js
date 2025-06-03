// app.js
const express = require('express');
const db = require('./database');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Get all invoices
app.get('/api/invoices', (req, res) => {
  const invoices = db.prepare(`
    SELECT invoices.*, issuers.name AS issuer_name, customers.name AS customer_name
    FROM invoices
    JOIN issuers ON invoices.issuer_id = issuers.id
    JOIN customers ON invoices.customer_id = customers.id
  `).all();
  res.json(invoices);
});

// Get invoice by ID
app.get('/api/invoices/:id', (req, res) => {
  const invoice = db.prepare(`
    SELECT invoices.*, issuers.name AS issuer_name, customers.name AS customer_name
    FROM invoices
    JOIN issuers ON invoices.issuer_id = issuers.id
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.id = ?
  `).get(req.params.id);

  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

// Create invoice
app.post('/api/invoices', (req, res) => {
  const { issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat } = req.body;
  const stmt = db.prepare(`
    INSERT INTO invoices (issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat);
  res.status(201).json({ id: result.lastInsertRowid });
});

// Update invoice
app.put('/api/invoices/:id', (req, res) => {
  const { issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat } = req.body;
  const stmt = db.prepare(`
    UPDATE invoices SET issuer_id = ?, customer_id = ?, number = ?, issue_date = ?, fulfillment_date = ?, due_date = ?, total = ?, vat = ?
    WHERE id = ?
  `);
  const result = stmt.run(issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat, req.params.id);

  if (result.changes > 0) {
    res.json({ message: 'Invoice updated' });
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

// Delete invoice
app.delete('/api/invoices/:id', (req, res) => {
  const stmt = db.prepare(`DELETE FROM invoices WHERE id = ?`);
  const result = stmt.run(req.params.id);

  if (result.changes > 0) {
    res.json({ message: 'Invoice deleted' });
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));