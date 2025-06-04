const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(__dirname, 'data/invoice.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS issuers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    tax_id TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    tax_id TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issuer_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    issue_date TEXT NOT NULL,
    fulfillment_date TEXT NOT NULL,
    payment_deadline TEXT NOT NULL,
    total_amount REAL NOT NULL,
    vat_rate REAL NOT NULL,
    FOREIGN KEY (issuer_id) REFERENCES issuers(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

// Check if tables empty
const issuerCount = db.prepare('SELECT COUNT(*) AS count FROM issuers').get().count;
const customerCount = db.prepare('SELECT COUNT(*) AS count FROM customers').get().count;
const invoiceCount = db.prepare('SELECT COUNT(*) AS count FROM invoices').get().count;

if(issuerCount === 0) {
  // Insert one issuer
  const insertIssuer = db.prepare('INSERT INTO issuers (name, address, tax_id) VALUES (?, ?, ?)');
  insertIssuer.run('Mega Kft.', 'Budapest, Fő utca 1.', '12345678-1-12');
}

if(customerCount === 0) {
  // Insert 3 customers
  const insertCustomer = db.prepare('INSERT INTO customers (name, address, tax_id) VALUES (?, ?, ?)');
  insertCustomer.run('Alfa Bt.', 'Debrecen, Kossuth tér 3.', '87654321-2-34');
  insertCustomer.run('Béta Zrt.', 'Szeged, Petőfi u. 12.', '11223344-3-56');
  insertCustomer.run('Gamma Kft.', 'Pécs, Rákóczi út 7.', '99887766-4-78');
}

if(invoiceCount === 0) {
  const issuerId = db.prepare('SELECT id FROM issuers LIMIT 1').get().id;
  const customers = db.prepare('SELECT id FROM customers').all();

  const insertInvoice = db.prepare(`
    INSERT INTO invoices (issuer_id, customer_id, invoice_number, issue_date, fulfillment_date,
      payment_deadline, total_amount, vat_rate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date();
  customers.forEach((customer, idx) => {
    for(let i = 1; i <=3; i++) {
      const issueDate = new Date(now.getTime() - (idx * 10 + i * 5) * 24 * 3600 * 1000);
      const fulfillmentDate = new Date(issueDate.getTime() + 2 * 24 * 3600 * 1000);
      const paymentDeadline = new Date(issueDate.getTime() + 30 * 24 * 3600 * 1000);

      insertInvoice.run(
        issuerId,
        customer.id,
        `INV-${customer.id}-${i}`,
        issueDate.toISOString().substring(0,10),
        fulfillmentDate.toISOString().substring(0,10),
        paymentDeadline.toISOString().substring(0,10),
        Math.round(10000 + Math.random() * 90000)/100, // total_amount between 100.00 and 1000.00
        [0.05, 0.18, 0.27][i % 3]  // some typical VAT rates in Hungary
      );
    }
  });
}

module.exports = db;
