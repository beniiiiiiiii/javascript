const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const app = express();
const db = new Database(path.join(__dirname, 'data', 'invoice.db'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;


const getIssuerById = (id) =>
  db.prepare('SELECT * FROM issuers WHERE id = ?').get(id);

const getCustomerById = (id) =>
  db.prepare('SELECT * FROM customers WHERE id = ?').get(id);


app.get('/api/invoices', (req, res) => {
  const invoices = db.prepare(`
    SELECT inv.*, 
      iss.name AS issuer_name, iss.address AS issuer_address, iss.tax_id AS issuer_tax_id,
      cust.name AS customer_name, cust.address AS customer_address, cust.tax_id AS customer_tax_id
    FROM invoices inv
    JOIN issuers iss ON inv.issuer_id = iss.id
    JOIN customers cust ON inv.customer_id = cust.id
    ORDER BY inv.issue_date DESC
  `).all();
  res.json(invoices);
});

app.post('/api/invoices', (req, res) => {
  const {
    issuer_id,
    customer_id,
    invoice_number,
    issue_date,
    fulfillment_date,
    payment_deadline,
    total_amount,
    vat_rate,
  } = req.body;

  if (
    !issuer_id ||
    !customer_id ||
    !invoice_number ||
    !issue_date ||
    !fulfillment_date ||
    !payment_deadline ||
    total_amount == null ||
    vat_rate == null
  ) {
    return res.status(400).json({ error: 'Hiányzó kötelező mezők' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO invoices 
      (issuer_id, customer_id, invoice_number, issue_date, fulfillment_date, payment_deadline, total_amount, vat_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      issuer_id,
      customer_id,
      invoice_number,
      issue_date,
      fulfillment_date,
      payment_deadline,
      total_amount,
      vat_rate
    );

    const newInvoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newInvoice);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Már létezik ilyen számla szám' });
    }
    res.status(500).json({ error: 'Nem várt hiba történt' });
  }
});



app.delete('/api/invoices/:id', (req, res) => {
  const id = req.params.id;
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
  if (!invoice) {
    return res.status(404).json({ error: 'A számla nem található' });
  }
  db.prepare('DELETE FROM invoices WHERE id = ?').run(id);
  res.json({ success: true });
});

app.get('/api/customers', (req, res) => {
  const customers = db.prepare('SELECT * FROM customers').all();
  res.json(customers);
});

app.get('/api/issuers', (req, res) => {
  const issuers = db.prepare('SELECT * FROM issuers').all();
  res.json(issuers);
});

// Issuers
app.post('/api/issuers', (req, res) => {
  const { name, address, tax_id } = req.body;
  if (!name || !address || !tax_id) {
    return res.status(400).json({ error: 'Hiányzó mezők' });
  }
  try {
    const stmt = db.prepare('INSERT INTO issuers (name, address, tax_id) VALUES (?, ?, ?)');
    const info = stmt.run(name, address, tax_id);
    const newIssuer = db.prepare('SELECT * FROM issuers WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newIssuer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});

app.put('/api/issuers/:id', (req, res) => {
  const id = req.params.id;
  const { name, address, tax_id } = req.body;
  if (!name || !address || !tax_id) {
    return res.status(400).json({ error: 'Hiányzó mezők' });
  }
  const issuer = db.prepare('SELECT * FROM issuers WHERE id = ?').get(id);
  if (!issuer) return res.status(404).json({ error: 'Nem található kiállító' });

  try {
    const stmt = db.prepare('UPDATE issuers SET name=?, address=?, tax_id=? WHERE id=?');
    stmt.run(name, address, tax_id, id);
    const updatedIssuer = db.prepare('SELECT * FROM issuers WHERE id = ?').get(id);
    res.json(updatedIssuer);
  } catch {
    res.status(500).json({ error: 'Szerverhiba' });
  }
});

// Customers
app.post('/api/customers', (req, res) => {
  const { name, address, tax_id } = req.body;
  if (!name || !address || !tax_id) {
    return res.status(400).json({ error: 'Hiányzó mezők' });
  }
  try {
    const stmt = db.prepare('INSERT INTO customers (name, address, tax_id) VALUES (?, ?, ?)');
    const info = stmt.run(name, address, tax_id);
    const newCustomer = db.prepare('SELECT * FROM customers WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});

app.put('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  const { name, address, tax_id } = req.body;
  if (!name || !address || !tax_id) {
    return res.status(400).json({ error: 'Hiányzó mezők' });
  }
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  if (!customer) return res.status(404).json({ error: 'Nem található vevő' });

  try {
    const stmt = db.prepare('UPDATE customers SET name=?, address=?, tax_id=? WHERE id=?');
    stmt.run(name, address, tax_id, id);
    const updatedCustomer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json(updatedCustomer);
  } catch {
    res.status(500).json({ error: 'Szerverhiba' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server fut a http://localhost:${PORT}`);
});
