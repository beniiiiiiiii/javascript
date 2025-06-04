document.addEventListener('DOMContentLoaded', () => {
  const invoicesList = document.getElementById('invoices-list');
  const invoiceForm = document.getElementById('invoice-form');
  const formTitle = document.getElementById('form-title');
  const invoiceIdInput = document.getElementById('invoice-id');
  const issuerSelect = document.getElementById('issuer-select');
  const customerSelect = document.getElementById('customer-select');
  const invoiceNumberInput = document.getElementById('invoice-number-input');
  const issueDateInput = document.getElementById('issue-date-input');
  const fulfillmentDateInput = document.getElementById('fulfillment-date-input');
  const paymentDeadlineInput = document.getElementById('payment-deadline-input');
  const totalAmountInput = document.getElementById('total-amount-input');
  const vatRateInput = document.getElementById('vat-rate-input');
  const saveButton = document.getElementById('save-button');
  const cancelButton = document.getElementById('cancel-button');
  const customerListDiv = document.getElementById('customer-list');
  const customerForm = document.getElementById('customer-form');
  const customerIdInput = document.getElementById('customer-id');
  const customerNameInput = document.getElementById('customer-name');
  const customerAddressInput = document.getElementById('customer-address');
  const customerTaxIdInput = document.getElementById('customer-tax-id');
  const customerSaveButton = document.getElementById('customer-save-button');
  const customerCancelButton = document.getElementById('customer-cancel-button');
  const issuerListDiv = document.getElementById('issuer-list');
  const issuerForm = document.getElementById('issuer-form');
  const issuerIdInput = document.getElementById('issuer-id');
  const issuerNameInput = document.getElementById('issuer-name');
  const issuerAddressInput = document.getElementById('issuer-address');
  const issuerTaxIdInput = document.getElementById('issuer-tax-id');
  const issuerSaveButton = document.getElementById('issuer-save-button');
  const issuerCancelButton = document.getElementById('issuer-cancel-button');

  let invoices = [];
  let issuers = [];
  let customers = [];
  let editMode = false;

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function fetchJson(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error fetching ${url}:`, err);
    alert(`Hiba történt az adatok lekérésekor: ${url}`);
    return null;
  }
}


  // Load issuers for dropdown
  async function loadIssuers() {
    try {
      const res = await fetch('/api/issuers');
      issuers = await res.json();
      issuerSelect.innerHTML =
        issuers.length > 0
          ? issuers
              .map(
                (iss) =>
                  `<option value="${iss.id}">${escapeHtml(iss.name)}</option>`
              )
              .join('')
          : '<option disabled>Nincs kiállító</option>';
    } catch {
      alert('Hiba a kiállítók betöltésekor');
    }
  }

  // Load customers for dropdown
  async function loadCustomers() {
    try {
      const res = await fetch('/api/customers');
      customers = await res.json();
      customerSelect.innerHTML =
        customers.length > 0
          ? customers
              .map(
                (cust) =>
                  `<option value="${cust.id}">${escapeHtml(cust.name)}</option>`
              )
              .join('')
          : '<option disabled>Nincs vevő</option>';
    } catch {
      alert('Hiba a vevők betöltésekor');
    }
  }

  // Load invoices and render
  async function loadInvoices() {
    try {
      const res = await fetch('/api/invoices');
      invoices = await res.json();
      renderInvoices();
    } catch {
      alert('Hiba a számlák betöltésekor');
    }
  }

  // Render invoices list
  function renderInvoices() {
    if (invoices.length === 0) {
      invoicesList.innerHTML = '<p>Nincsenek számlák.</p>';
      return;
    }
    invoicesList.innerHTML = invoices
      .map((inv) => {
        return `
        <div class="invoice-card" data-id="${inv.id}">
          <div class="invoice-header">
            <div class="invoice-number">${escapeHtml(inv.invoice_number)}</div>
            <div class="invoice-actions">
              <button class="edit-btn" title="Szerkesztés">✏️</button>
              <button class="delete-btn" title="Törlés">🗑️</button>
            </div>
          </div>
          <div class="invoice-section">
            <div class="invoice-issuer">
              <strong>Kiállító:</strong> ${escapeHtml(inv.issuer_name)}<br />
              <small>${escapeHtml(inv.issuer_address)} | Adószám: ${escapeHtml(inv.issuer_tax_id)}</small>
            </div>
            <div class="invoice-client" style="margin-top: 0.5rem;">
              <strong>Vevő:</strong> ${escapeHtml(inv.customer_name)}<br />
              <small>${escapeHtml(inv.customer_address)} | Adószám: ${escapeHtml(inv.customer_tax_id)}</small>
            </div>
          </div>
          <div class="invoice-meta">
            <div class="invoice-field"><strong>Számla kelte:</strong> ${inv.issue_date}</div>
            <div class="invoice-field"><strong>Teljesítés dátuma:</strong> ${inv.fulfillment_date}</div>
            <div class="invoice-field"><strong>Fizetési határidő:</strong> ${inv.payment_deadline}</div>
            <div class="invoice-field"><strong>Végösszeg:</strong> ${inv.total_amount.toFixed(2)} Ft</div>
            <div class="invoice-field"><strong>ÁFA kulcs:</strong> ${(inv.vat_rate * 100).toFixed(2)} %</div>
          </div>
        </div>
        `;
      })
      .join('');

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', onEditClick);
    });
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', onDeleteClick);
    });
  }

  // Handle edit invoice click
  function onEditClick(e) {
    const invoiceId = e.target.closest('.invoice-card').dataset.id;
    const invoice = invoices.find((i) => i.id == invoiceId);
    if (!invoice) {
      alert('A számla nem található.');
      return;
    }

    invoiceIdInput.value = invoice.id;
    issuerSelect.value = invoice.issuer_id;
    customerSelect.value = invoice.customer_id;
    invoiceNumberInput.value = invoice.invoice_number;
    issueDateInput.value = invoice.issue_date;
    fulfillmentDateInput.value = invoice.fulfillment_date;
    paymentDeadlineInput.value = invoice.payment_deadline;
    totalAmountInput.value = invoice.total_amount;
    vatRateInput.value = (invoice.vat_rate * 100).toFixed(2);

    editMode = true;
    formTitle.textContent = 'Számla szerkesztése';
    saveButton.textContent = 'Frissítés';
    cancelButton.classList.remove('hidden');
  }

  // Handle delete invoice click
  async function onDeleteClick(e) {
    if (!confirm('Biztosan törölni szeretnéd a számlát?')) return;
    const invoiceId = e.target.closest('.invoice-card').dataset.id;

    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await loadInvoices();
        if (invoiceIdInput.value === invoiceId) resetForm();
      } else {
        alert('A törlés sikertelen volt.');
      }
    } catch {
      alert('Hiba történt a törlés során.');
    }
  }

  // Reset form to initial state
  function resetForm() {
    invoiceIdInput.value = '';
    issuerSelect.value = issuers.length ? issuers[0].id : '';
    customerSelect.value = customers.length ? customers[0].id : '';
    invoiceNumberInput.value = '';
    issueDateInput.value = '';
    fulfillmentDateInput.value = '';
    paymentDeadlineInput.value = '';
    totalAmountInput.value = '';
    vatRateInput.value = '';

    editMode = false;
    formTitle.textContent = 'Új Számla Létrehozása';
    saveButton.textContent = 'Mentés';
    cancelButton.classList.add('hidden');
  }

  // Handle form submission (create/update)
  invoiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = invoiceIdInput.value;
    const issuer_id = issuerSelect.value;
    const customer_id = customerSelect.value;
    const invoice_number = invoiceNumberInput.value.trim();
    const issue_date = issueDateInput.value;
    const fulfillment_date = fulfillmentDateInput.value;
    const payment_deadline = paymentDeadlineInput.value;
    const total_amount = parseFloat(totalAmountInput.value);
    const vat_rate = parseFloat(vatRateInput.value) / 100;

    if (
      !issuer_id ||
      !customer_id ||
      !invoice_number ||
      !issue_date ||
      !fulfillment_date ||
      !payment_deadline ||
      isNaN(total_amount) ||
      isNaN(vat_rate)
    ) {
      return alert('Kérlek tölts ki minden mezőt helyesen.');
    }

    // Simple date validation
    if (
      new Date(issue_date) > new Date(fulfillment_date) ||
      new Date(issue_date) > new Date(payment_deadline)
    ) {
      return alert('A dátumok nem érvényes sorrendben vannak.');
    }

    const payload = {
      issuer_id,
      customer_id,
      invoice_number,
      issue_date,
      fulfillment_date,
      payment_deadline,
      total_amount,
      vat_rate,
    };

    try {
      let res;
      if (editMode) {
        res = await fetch(`/api/invoices/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        return alert(`Hiba: ${errData.error || 'Ismeretlen hiba történt'}`);
      }

      await loadInvoices();
      resetForm();
    } catch {
      alert('Hiba történt a mentés során.');
    }
  });

  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    resetForm();
  });



// Render customer list
function renderCustomers() {
  if (!customers.length) {
    customerListDiv.innerHTML = '<p>Nincsenek vevők.</p>';
    return;
  }
  customerListDiv.innerHTML = customers
    .map(
      (cust) => `
      <div class="customer-item" data-id="${cust.id}">
        <span>${escapeHtml(cust.name)}</span>
        <button class="edit-customer-btn" title="Szerkesztés">✏️</button>
      </div>`
    )
    .join('');

  document.querySelectorAll('.edit-customer-btn').forEach((btn) => {
    btn.removeEventListener('click', onEditCustomerClick);
    btn.addEventListener('click', onEditCustomerClick);
  });
}

// Load customers (reuse existing loadCustomers but add renderCustomers call)
async function loadCustomers() {
  const data = await fetchJson('/api/customers');
  if (data) {
    customers = data;
    renderCustomers();

    // Also update the invoice customer select
    customerSelect.innerHTML = customers.length
      ? customers
          .map(
            (cust) =>
              `<option value="${cust.id}">${escapeHtml(cust.name)}</option>`
          )
          .join('')
      : '<option disabled>Nem található vevő</option>';
  }
}

// Handle edit button click in customer list
function onEditCustomerClick(e) {
  const customerId = e.target.closest('.customer-item').dataset.id;
  const cust = customers.find((c) => c.id == customerId);
  if (!cust) {
    alert('Nem található vevő.');
    return;
  }
  customerIdInput.value = cust.id;
  customerNameInput.value = cust.name;
  customerAddressInput.value = cust.address;
  customerTaxIdInput.value = cust.tax_id;

  customerSaveButton.textContent = 'Frissítés';
  customerCancelButton.classList.remove('hidden');
}

// Reset customer form
function resetCustomerForm() {
  customerIdInput.value = '';
  customerNameInput.value = '';
  customerAddressInput.value = '';
  customerTaxIdInput.value = '';

  customerSaveButton.textContent = 'Mentés';
  customerCancelButton.classList.add('hidden');
}

// Handle customer form submit for add/update
customerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = customerIdInput.value;
  const name = customerNameInput.value.trim();
  const address = customerAddressInput.value.trim();
  const tax_id = customerTaxIdInput.value.trim();

  if (!name || !address || !tax_id) {
    return alert('Kérlek tölts ki minden mezőt.');
  }

  const payload = { name, address, tax_id };

  try {
    const url = id ? `/api/customers/${id}` : '/api/customers';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Ismeretlen hiba történt');
    }

    await loadCustomers();
    resetCustomerForm();
  } catch (err) {
    alert(`Hiba: ${err.message}`);
  }
});

customerCancelButton.addEventListener('click', (e) => {
  e.preventDefault();
  resetCustomerForm();
});


// Render issuer list
function renderIssuers() {
  if (!issuers.length) {
    issuerListDiv.innerHTML = '<p>Nincsenek kiállítók.</p>';
    return;
  }
  issuerListDiv.innerHTML = issuers
    .map(
      (iss) => `
    <div class="issuer-item" data-id="${iss.id}">
      <span>${escapeHtml(iss.name)}</span>
      <button class="edit-issuer-btn" title="Szerkesztés">✏️</button>
    </div>`
    )
    .join('');

  document.querySelectorAll('.edit-issuer-btn').forEach((btn) => {
    btn.removeEventListener('click', onEditIssuerClick);
    btn.addEventListener('click', onEditIssuerClick);
  });
}

// Load issuers (reuse existing loadIssuers but add renderIssuers call)
async function loadIssuers() {
  const data = await fetchJson('/api/issuers');
  if (data) {
    issuers = data;
    renderIssuers();

    // Also update the invoice issuer select
    issuerSelect.innerHTML = issuers.length
      ? issuers
          .map(
            (iss) =>
              `<option value="${iss.id}">${escapeHtml(iss.name)}</option>`
          )
          .join('')
      : '<option disabled>Nem található kiállító</option>';
  }
}

// Handle edit button click in issuer list
function onEditIssuerClick(e) {
  const issuerId = e.target.closest('.issuer-item').dataset.id;
  const iss = issuers.find((i) => i.id == issuerId);
  if (!iss) {
    alert('Nem található kiállító.');
    return;
  }
  issuerIdInput.value = iss.id;
  issuerNameInput.value = iss.name;
  issuerAddressInput.value = iss.address;
  issuerTaxIdInput.value = iss.tax_id;

  issuerSaveButton.textContent = 'Frissítés';
  issuerCancelButton.classList.remove('hidden');
}

// Reset issuer form
function resetIssuerForm() {
  issuerIdInput.value = '';
  issuerNameInput.value = '';
  issuerAddressInput.value = '';
  issuerTaxIdInput.value = '';

  issuerSaveButton.textContent = 'Mentés';
  issuerCancelButton.classList.add('hidden');
}

// Handle issuer form submit for add/update
issuerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = issuerIdInput.value;
  const name = issuerNameInput.value.trim();
  const address = issuerAddressInput.value.trim();
  const tax_id = issuerTaxIdInput.value.trim();

  if (!name || !address || !tax_id) {
    return alert('Kérlek tölts ki minden mezőt.');
  }

  const payload = { name, address, tax_id };

  try {
    const url = id ? `/api/issuers/${id}` : '/api/issuers';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Ismeretlen hiba történt');
    }

    await loadIssuers();
    resetIssuerForm();
  } catch (err) {
    alert(`Hiba: ${err.message}`);
  }
});

issuerCancelButton.addEventListener('click', (e) => {
  e.preventDefault();
  resetIssuerForm();
});



  // Initialize the page
  (async () => {
    await loadIssuers();
    await loadCustomers();
    await loadInvoices();
    resetForm();
  })();
});
