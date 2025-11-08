
// ==============================
// Головні елементи
// ==============================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('filterCategory');
const brandFilter = document.getElementById('filterBrand');
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');
const applyPrice = document.getElementById('applyPrice');
const resetFilters = document.getElementById('resetFilters');
const productCards = document.querySelectorAll('.product-card');
const cartCount = document.getElementById('cartCount');

let cart = []; // масив для кошика

// ==============================
// Пошук
// ==============================
searchBtn.addEventListener('click', filterProducts);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') filterProducts();
});

// ==============================
// Фільтри
// ==============================
categoryFilter.addEventListener('change', filterProducts);
brandFilter.addEventListener('change', filterProducts);
applyPrice.addEventListener('click', filterProducts);
resetFilters.addEventListener('click', resetAllFilters);

// ==============================
// Основна функція фільтрації
// ==============================
function filterProducts() {
  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const brand = brandFilter.value;
  const min = parseFloat(priceMin.value) || 0;
  const max = parseFloat(priceMax.value) || Infinity;

  productCards.forEach(card => {
    const name = card.querySelector('h4').textContent.toLowerCase();
    const info = card.querySelector('p').textContent.toLowerCase();
    const priceText = card.querySelector('.price').textContent.replace(/[^\d]/g, '');
    const price = parseFloat(priceText);

    const matchesSearch = name.includes(searchText);
    const matchesCategory = category === '' || info.includes(category.toLowerCase());
    const matchesBrand = brand === '' || info.includes(brand.toLowerCase());
    const matchesPrice = price >= min && price <= max;

    if (matchesSearch && matchesCategory && matchesBrand && matchesPrice) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ==============================
// Скидання всіх фільтрів
// ==============================
function resetAllFilters() {
  searchInput.value = '';
  categoryFilter.value = '';
  brandFilter.value = '';
  priceMin.value = '';
  priceMax.value = '';

  productCards.forEach(card => {
    card.style.display = 'block';
  });
}

// ==============================
// Кнопки "Додати в кошик"
// ==============================
document.querySelectorAll('.buy-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const name = card.querySelector('h4').textContent;
    const price = card.querySelector('.price').textContent;

    addToCart(name, price);
  });
});

// ==============================
// Додавання в кошик
// ==============================
function addToCart(name, price) {
  cart.push({ name, price, quantity: 1 });
localStorage.setItem("cart", JSON.stringify(cart));
cartCount.textContent = cart.length;
alert(`✅ ${name} (${price}) додано до кошика!`);

}
document.querySelectorAll('.buy-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const name = card.querySelector('h4').textContent;
    const priceText = card.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById('cartCount').textContent = cart.length;
    alert(`✅ ${name} додано до кошика!`);
  });
});
// Відображення короткого опису при натисканні на товар
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', (event) => {
    // Якщо натиснули на кнопку "Додати в кошик" — не показувати опис
    if (event.target.classList.contains('buy-btn')) return;

    const description = card.getAttribute('data-description');
    showDescriptionPopup(description, card);
  });
});
// Показ короткого опису товару в модальному вікні
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', (event) => {
    // Не показуємо опис при кліку на кнопку
    if (event.target.classList.contains('buy-btn')) return;

    const description = card.getAttribute('data-description');
    showModal(description);
  });
});

function showModal(text) {
  // Якщо вже є модалка — видаляємо
  const existing = document.querySelector('.modal');
  if (existing) existing.remove();

  // Створюємо елементи
  const modal = document.createElement('div');
  modal.className = 'modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.innerHTML = `
    <p>${text}</p>
    <button id="closeModal">Закрити</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Закриття при натисканні
  document.getElementById('closeModal').onclick = () => modal.remove();
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

