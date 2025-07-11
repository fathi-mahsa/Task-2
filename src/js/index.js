//* Cached DOM elements
const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const tableBox = document.querySelector('.tableBox');
const table = document.querySelector('#transactionsTable');
const tbody = document.querySelector('#tableBody');
const msg = document.querySelector('#searchMessage');

//* Sorting variables
let currentSortField = null;
let currentSortOrder = 'asc';

//* Load data from server & Search box
function loadTransactions() {
  searchInput.style.display = 'inline-block';
  searchBtn.style.display = 'inline-block';
  tableBox.style.display = 'flex';
  fetchData('http://localhost:3000/transactions');
}

//* Fetch data and render the table
function fetchData(url) {
  table.style.display = 'none';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      table.style.display = 'table';
      if (data.length) {
        renderTable(data);
      } else {
        renderEmptyRow(); 
      }
    })
    .catch(console.error);
}

//* Render all rows
function renderTable(data) {
  tbody.innerHTML = '';
  data.forEach(item => {
    const tr = document.createElement('tr');
    const typeClass = item.type === 'افزایش اعتبار' ? 'deposit' : 'withdraw';
    tr.innerHTML = `
      <td>${item.id}</td>
      <td class="${typeClass}">${item.type}</td>
      <td>${item.price.toLocaleString()} تومان</td>
      <td>${item.refId}</td>
      <td>${new Date(item.date).toLocaleString('fa-IR')}</td>
    `;
    tbody.appendChild(tr);
  });
}

//* No data found
function renderEmptyRow() {
  tbody.innerHTML =
   `<tr><td colspan="4">موردی یافت نشد.</td></tr>`;
}

//* Search by refId
function searchTransactions() {
  const value = searchInput.value.trim();
  msg.textContent = '';

  if (!value) {
    msg.textContent = 'لطفاً شماره پیگیری را وارد کنید!';
    return;
  }
  fetch('http://localhost:3000/transactions')
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(item => item.refId.toString().includes(value));
    renderTable(filtered);
  })
}

//* Sort by price, date
function sortBy(field) {
  currentSortField = field;
  currentSortOrder = 'asc';

  const url = `http://localhost:3000/transactions?_sort=${field}&_order=${currentSortOrder}`;
  fetchData(url);
  updateArrows(field);
}

//* Update sort arrows
function updateArrows(field) {
  document.querySelectorAll('.arrow').forEach(el => {
    el.classList.remove('active', 'desc');
  });

  const arrow = document.getElementById(`${field}Arrow`);
  if (arrow) {
    arrow.classList.add('active');
  }
}

//* Sorting, loading, searching
window.addEventListener('load', function () {
  const priceHeader = document.querySelector('#priceHeader');
  const dateHeader = document.querySelector('#dateHeader');
  const loadBtn = document.querySelector('#loadBtn');
  const searchBtn = document.querySelector('#searchBtn');

  if (priceHeader) {
    priceHeader.addEventListener('click', function () {
      sortBy('price');
    });
  }
  if (dateHeader) {
    dateHeader.addEventListener('click', function () {
      sortBy('date');
    });
  }
  if (loadBtn) {
    loadBtn.addEventListener('click', function() {
      loadTransactions(); 
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      searchTransactions();
    });
  }
});
