const express = require('express');
const app = express();
const db = require('./database');
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

app.get('/api/invoices', (req, res) => {
  const invoices = db.prepare(`
    SELECT invoices.*, issuers.name AS issuer_name, customers.name AS customer_name
    FROM invoices
    JOIN issuers ON invoices.issuer_id = issuers.id
    JOIN customers ON invoices.customer_id = customers.id
  `).all();
  res.json(invoices);
});

app.post('/api/invoices', (req, res) => {
  const { issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat } = req.body;
  const stmt = db.prepare(`
    INSERT INTO invoices (issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat);
  res.json({ id: result.lastInsertRowid });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

// --- database.js ---
const Database = require('better-sqlite3');
const db = new Database('invoices.db');

// Create tables

db.exec(`
  CREATE TABLE IF NOT EXISTS issuers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    address TEXT,
    tax_number TEXT
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    address TEXT,
    tax_number TEXT
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY,
    issuer_id INTEGER,
    customer_id INTEGER,
    number TEXT,
    issue_date TEXT,
    fulfillment_date TEXT,
    due_date TEXT,
    total REAL,
    vat REAL,
    FOREIGN KEY (issuer_id) REFERENCES issuers(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

// Insert sample data
const insertIssuer = db.prepare('INSERT OR IGNORE INTO issuers (id, name, address, tax_number) VALUES (?, ?, ?, ?)');
insertIssuer.run(1, 'Alpha Kft.', 'Budapest, Fő utca 1.', '12345678-1-42');

const insertCustomer = db.prepare('INSERT OR IGNORE INTO customers (id, name, address, tax_number) VALUES (?, ?, ?, ?)');
insertCustomer.run(1, 'Béta Bt.', 'Debrecen, Béke utca 10.', '87654321-2-33');
insertCustomer.run(2, 'Gamma Zrt.', 'Szeged, Szabadság tér 3.', '23456789-3-21');
insertCustomer.run(3, 'Delta Kft.', 'Pécs, Kossuth L. u. 12.', '34567890-4-12');

const insertInvoice = db.prepare(`
  INSERT OR IGNORE INTO invoices (id, issuer_id, customer_id, number, issue_date, fulfillment_date, due_date, total, vat)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertInvoice.run(1, 1, 1, 'INV-001', '2025-01-01', '2025-01-01', '2025-01-15', 100000, 27000);
insertInvoice.run(2, 1, 1, 'INV-002', '2025-02-01', '2025-02-01', '2025-02-15', 200000, 54000);
insertInvoice.run(3, 1, 1, 'INV-003', '2025-03-01', '2025-03-01', '2025-03-15', 150000, 40500);
insertInvoice.run(4, 1, 2, 'INV-004', '2025-01-05', '2025-01-05', '2025-01-20', 120000, 32400);
insertInvoice.run(5, 1, 2, 'INV-005', '2025-02-05', '2025-02-05', '2025-02-20', 130000, 35100);
insertInvoice.run(6, 1, 2, 'INV-006', '2025-03-05', '2025-03-05', '2025-03-20', 140000, 37800);
insertInvoice.run(7, 1, 3, 'INV-007', '2025-01-10', '2025-01-10', '2025-01-25', 160000, 43200);
insertInvoice.run(8, 1, 3, 'INV-008', '2025-02-10', '2025-02-10', '2025-02-25', 170000, 45900);
insertInvoice.run(9, 1, 3, 'INV-009', '2025-03-10', '2025-03-10', '2025-03-25', 180000, 48600);

module.exports = db;