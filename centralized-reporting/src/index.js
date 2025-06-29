const express = require('express');
const fetch = require('node-fetch');
const { Parser } = require('json2csv');
const app = express();

// Helper to fetch and convert to CSV
async function fetchAndCsv(url, fields, filename, res) {
  const data = await fetch(url).then(r => r.json());
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(filename);
  res.send(csv);
}

// Sales report
app.get('/reports/sales', async (req, res) => {
  const { from, to } = req.query;
  const data = await fetch('http://analytics-engine:8080/metrics/sales').then(r => r.json());
  const daily = data.daily || {};
  const rows = Object.entries(daily)
    .filter(([date]) => (!from || date >= from) && (!to || date <= to))
    .map(([date, amount]) => ({ date, amount }));
  const parser = new Parser({ fields: ['date', 'amount'] });
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('sales_report.csv');
  res.send(csv);
});

// Inventory report
app.get('/reports/inventory', async (req, res) => {
  const data = await fetch('http://analytics-engine:8080/metrics/inventory').then(r => r.json());
  const byProduct = data.byProduct || {};
  const rows = Object.entries(byProduct).map(([productId, quantity]) => ({ productId, quantity }));
  const parser = new Parser({ fields: ['productId', 'quantity'] });
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('inventory_report.csv');
  res.send(csv);
});

// Performance report
app.get('/reports/performance', async (req, res) => {
  const data = await fetch('http://analytics-engine:8080/metrics/performance').then(r => r.json());
  const byService = data.byService || {};
  const rows = Object.entries(byService).map(([service, stats]) => ({ service, ...stats }));
  const parser = new Parser({ fields: ['service', 'avgLatency', 'avgErrorRate', 'avgThroughput'] });
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('performance_report.csv');
  res.send(csv);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Reporting Service running on port ${PORT}`);
}); 