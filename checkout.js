document.addEventListener("DOMContentLoaded", () => {
    const orderContainer = document.querySelector(".order-container");
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const waLink = document.getElementById("whatsappLink"); // Ссылка для WhatsApp
    const userNameInput = document.getElementById("user__name");
    const userPhoneInput = document.getElementById("phone");
    const userAddressInput = document.getElementById("adress");

    if (Object.keys(cart).length === 0) {
        orderContainer.innerHTML = "<p class='total__cost'>Корзина пуста. Вернитесь к покупкам!</p>";
        return;
    }

    let orderHTML = "";
    let totalPrice = 0;

    // Отображение товаров в корзине
    for (const productId in cart) {
        const item = cart[productId];
        totalPrice += item.price * item.quantity;

        orderHTML += `
            <div class="order-item">
                <div class="order__item_one">
                    <div class="card__image">
                        <img src="${item.img}" alt="${item.name}" style="object-fit: cover">
                    </div>
                    <p class="order__name"><strong>${item.name}</strong></p>
                </div>
                <p class="order__amount">Количество: 
                    <button class="quantity-minus" data-id="${productId}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-plus" data-id="${productId}">+</button>
                </p>
                <p class="amount">${item.price * item.quantity} тг</p>
            </div>
        `;
    }

    orderHTML += `<p class="total__cost"><strong>Общая сумма: ${totalPrice} тг</strong></p>`;
    orderContainer.innerHTML = orderHTML;

    // Обработчики для кнопок плюс и минус
    document.querySelectorAll('.quantity-plus').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            updateQuantity(productId, 1); // Увеличиваем количество на 1
        });
    });

    document.querySelectorAll('.quantity-minus').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            updateQuantity(productId, -1); // Уменьшаем количество на 1
        });
    });

    // Функция для обновления количества товара в корзине
    const updateQuantity = (productId, change) => {
        if (cart[productId]) {
            cart[productId].quantity += change;
            if (cart[productId].quantity <= 0) {
                delete cart[productId]; // Удаляем товар из корзины, если количество 0
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart)); // Сохраняем обновленную корзину
        displayUpdatedCart(); // Обновляем отображение корзины
        generateWhatsAppLink(); // Обновляем ссылку на WhatsApp
    };

    // Функция для перерисовки корзины
    const displayUpdatedCart = () => {
        let orderHTML = "";
        let totalPrice = 0;

        for (const productId in cart) {
            const item = cart[productId];
            totalPrice += item.price * item.quantity;

            orderHTML += `
                <div class="order-item">
                    <div class="order__item_one">
                        <div class="card__image">
                            <img src="${item.img}" alt="${item.name}" style="object-fit: cover">
                        </div>
                        <p class="order__name"><strong>${item.name}</strong></p>
                    </div>
                    <p class="order__amount">Количество: 
                        <button class="quantity-minus" data-id="${productId}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-plus" data-id="${productId}">+</button>
                    </p>
                    <p class="amount">${item.price * item.quantity} тг</p>
                </div>
            `;
        }

        orderHTML += `<p class="total__cost"><strong>Общая сумма: ${totalPrice} тг</strong></p>`;
        orderContainer.innerHTML = orderHTML;

        // Обновляем обработчики на новые кнопки
        document.querySelectorAll('.quantity-plus').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                updateQuantity(productId, 1); // Увеличиваем количество на 1
            });
        });

        document.querySelectorAll('.quantity-minus').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                updateQuantity(productId, -1); // Уменьшаем количество на 1
            });
        });
    };

    // Генерация ссылки для WhatsApp с актуальной корзиной
    const generateWhatsAppLink = () => {
        let message = "Здравствуйте! Я хочу заказать следующие товары:\n\n";
        let hasItems = false;
        let total = 0;

        for (const productId in cart) {
            if (cart[productId].quantity > 0) {
                const itemTotal = cart[productId].price * cart[productId].quantity;
                message += `${cart[productId].name} - ${cart[productId].quantity} шт., Сумма: ${itemTotal} тг\n`;
                total += itemTotal;
                hasItems = true;
            }
        }

        if (!hasItems) {
            message += "Корзина пуста.";
        } else {
            message += `\nОбщая сумма: ${total} тг`;
            message += `\nИмя: ${userNameInput.value}`;
            message += `\nТелефон: ${userPhoneInput.value}`;
            message += `\nАдрес: ${userAddressInput.value}`;
        }

        // Обновление ссылки на WhatsApp
        waLink.href = `https://wa.me/77084710300?text=${encodeURIComponent(message)}`;
    };

    // Добавляем обработчики на изменения в полях ввода
    userNameInput.addEventListener("input", generateWhatsAppLink);
    userPhoneInput.addEventListener("input", generateWhatsAppLink);
    userAddressInput.addEventListener("input", generateWhatsAppLink);


    clearCartButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (confirm("Вы уверены, что хотите очистить корзину?")) {
            localStorage.removeItem("cart"); // Удаляем корзину из localStorage
            location.reload(); // Перезагружаем страницу для обновления интерфейса
        }
    });

    // Инициализация
    generateWhatsAppLink(); // Генерация начальной ссылки
});


// Загружаем корзину из localStorage
// let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Функция для отображения товаров в корзине
// const displayCartItems = () => {
//     const stuffWrapper = document.querySelector('.stuff__wrapper');
//     stuffWrapper.innerHTML = ""; // Очищаем содержимое

//     let total = 0;

//     // Проходимся по каждому товару в корзине
//     for (const id in cart) {
//         const item = cart[id]; // Получаем объект товара
//         const itemTotalPrice = item.price * item.quantity; // Считаем стоимость товара
//         total += itemTotalPrice; // Добавляем к общей сумме

//         // Создаем HTML для товара
//         const productHTML = `
//             <div class="cart-item" data-id="${id}">
//                 <h3>${item.name}</h3>
//                 <p>Цена: ${item.price} тг</p>
//                 <p>Количество:
//                     <button class="minus" data-id="${id}">-</button>
//                     <span>${item.quantity}</span>
//                     <button class="plus" data-id="${id}">+</button>
//                 </p>
//                 <p>Итого: ${itemTotalPrice} тг</p>
//             </div>
//         `;
//         stuffWrapper.innerHTML += productHTML;
//     }

//     // Отображение общей суммы
//     const cartTotalElement = document.querySelector('.cart-total');
//     cartTotalElement.textContent = `Общая сумма: ${total} тг`;

//     // Обновляем ссылку WhatsApp
//     generateWhatsAppLink();
// };

// // Функция для обновления корзины
// const updateCart = (id, quantityChange) => {
//     if (cart[id]) {
//         cart[id].quantity += quantityChange;

//         // Если количество меньше или равно 0, удаляем товар из корзины
//         if (cart[id].quantity <= 0) {
//             delete cart[id];
//         }
//     }

//     // Сохраняем обновленную корзину в localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));

//     // Перерисовываем корзину
//     displayCartItems();
// };

// // Генерация ссылки WhatsApp
// const generateWhatsAppLink = () => {
//     let message = "Здравствуйте! Я хочу заказать следующие товары:\n\n";
//     let total = 0;
//     let hasItems = false;

//     for (const id in cart) {
//         const item = cart[id];
//         if (item.quantity > 0) {
//             const itemTotal = item.price * item.quantity;
//             message += `${item.name} - ${item.quantity} шт., Сумма: ${itemTotal} тг\n`;
//             total += itemTotal;
//             hasItems = true;
//         }
//     }

//     if (!hasItems) {
//         message += "Корзина пуста.";
//     } else {
//         message += `\nОбщая сумма: ${total} тг`;
//     }

//     const waLink = document.getElementById('whatsappLink');
//     waLink.href = `https://wa.me/77767913640?text=${encodeURIComponent(message)}`;
// };

// // Добавляем события на кнопки плюс и минус
// document.addEventListener('click', (event) => {
//     if (event.target.classList.contains('plus')) {
//         const id = event.target.dataset.id;
//         updateCart(id, 1); // Увеличиваем количество
//     } else if (event.target.classList.contains('minus')) {
//         const id = event.target.dataset.id;
//         updateCart(id, -1); // Уменьшаем количество
//     }
// });

// console.log("Корзина:", cart);
// // Инициализация
// displayCartItems();
