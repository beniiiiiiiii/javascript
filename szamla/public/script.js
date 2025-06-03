fetch('/api/invoices')
  .then(res => res.json())
  .then(invoices => {
    const tbody = document.querySelector('#invoice-table tbody');
    let totalSum = 0;
    let vatSum = 0;
    invoices.forEach(inv => {
      totalSum += inv.total;
      vatSum += inv.vat;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${inv.number}</td>
        <td>${inv.issuer_name}</td>
        <td>${inv.customer_name}</td>
        <td>${inv.issue_date}</td>
        <td>${inv.fulfillment_date}</td>
        <td>${inv.due_date}</td>
        <td>${inv.total.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF' })}</td>
        <td>${inv.vat.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF' })}</td>
      `;
      tbody.appendChild(tr);
    });
    const summary = document.getElementById('summary');
    summary.textContent = `Összesen: ${totalSum.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF' })} (ÁFA: ${vatSum.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF' })})`;
  });