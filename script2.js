document.addEventListener("DOMContentLoaded", () => {
  const orderTableBody = document.querySelector("#orderTable tbody");
  const totalPriceElement = document.getElementById("totalPrice");
  const paymentMethod = document.getElementById("paymentMethod");
  const cardDetails = document.getElementById("cardDetails");
  const checkoutForm = document.getElementById("checkoutForm");

  // === Отримуємо кошик з localStorage ===
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // === Функція оновлення таблиці ===
  function renderCart() {
    orderTableBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const row = document.createElement("tr");

      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const subtotal = price * quantity;

      total += subtotal;

      row.innerHTML = `
        <td>${item.name}</td>
        <td>
          <input type="number" min="1" class="qty-input" data-index="${index}" value="${quantity}" style="width:60px;text-align:center;">
        </td>
        <td>${price.toFixed(2)} ₴</td>
        <td>${subtotal.toFixed(2)} ₴</td>
        <td><button class="remove-btn" data-index="${index}">✖</button></td>
      `;

      orderTableBody.appendChild(row);
    });

    // 🔹 Оновлення загальної суми
    totalPriceElement.innerHTML = `<strong>Загальна сума:</strong> ${total.toFixed(2)} ₴`;

    // 🔹 Обробка кнопки видалення
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    // 🔹 Обробка зміни кількості
    document.querySelectorAll(".qty-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.getAttribute("data-index");
        const newQty = parseInt(e.target.value);
        if (newQty > 0) {
          cart[index].quantity = newQty;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        }
      });
    });
  }

  // === Відображення при завантаженні сторінки ===
  renderCart();

  // === Показ або приховування карткових полів ===
  paymentMethod.addEventListener("change", () => {
    cardDetails.classList.toggle("hidden", paymentMethod.value !== "card");
  });

  // === Обробка оформлення замовлення ===
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const delivery = document.getElementById("deliveryType").value;
    const payment = paymentMethod.value;

    if (!name || !email || !phone || !address || !delivery || !payment) {
      alert("Будь ласка, заповніть усі поля перед оформленням замовлення!");
      return;
    }

    if (payment === "card") {
      const cardNum = document.getElementById("cardNumber").value.trim();
      const cardExp = document.getElementById("cardExpiry").value.trim();
      const cardCVV = document.getElementById("cardCVV").value.trim();

      if (!cardNum || !cardExp || !cardCVV) {
        alert("Введіть усі дані картки!");
        return;
      }
    }

    alert("✅ Ваше замовлення успішно оформлене! Дякуємо, що обрали AutoParts 💚");

    // Очищення кошика
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
    checkoutForm.reset();
    cardDetails.classList.add("hidden");
  });
});
// === Показ або приховування карткових полів ===
document.addEventListener("DOMContentLoaded", () => {
  const paymentSelect = document.getElementById("payment");
  const cardDetails = document.getElementById("cardDetails");

  if (paymentSelect) {
    paymentSelect.addEventListener("change", () => {
      cardDetails.classList.toggle("hidden", paymentSelect.value !== "card");
    });
  }
});
