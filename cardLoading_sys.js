document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.querySelector(".product__cards");
    const navButtons = document.querySelectorAll(".main__nav_btn");
    const cart = JSON.parse(localStorage.getItem('cart')) || {}; // Загружаем корзину из localStorage, если она есть

    let allProducts = []; // Для хранения всех товаров после загрузки из JSON

    // Функция для фильтрации и отображения товаров по категории
    const filterProductsByCategory = (category) => {
        productsContainer.innerHTML = ""; // Очищаем контейнер с товарами

        const filteredProducts = allProducts.filter(product =>
            product.product__type === category || category === "all"
        );

        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    };

    // Навигация по категориям
    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.type; // Получаем категорию из data-type кнопки
            filterProductsByCategory(category); // Фильтруем товары
        });
    });

    // Функция для создания карточки товара
    const createProductCard = (product) => {
        const card = document.createElement("div");
        card.className = "product__card";
        card.dataset.productId = product.id; // Сохраняем ID товара
        card.dataset.productType = product.product__type; // Сохраняем категорию товара из JSON
        card.dataset.description = product.description; 
        // Проверяем наличие discount и формируем HTML
        const discountHTML = (product.discount && product.discount !== product.price)
            ? `<span class="discount">${product.discount} тг</span>`
            : '';

        card.innerHTML = `
         <div class="card__image">
            <img src="${product.img}" alt="${product.name}" style="object-fit: cover">
        </div>
        <div class="card__content" style="width: 100%">
            
            <div class="card__product_name">
                <p class="product_name_item" align="left">${product.name}</p>
            </div>
            <div class="card__product_disc">
                 <a class="disc__btn">Подробнее</a>
            </div>
            <div class="card__price">${product.price} тг ${discountHTML}</div>
            <div class="card__disc_button" style="display:none">
                <a href="#" class="disc__button_item">Подробнее</a>
            </div>
            <div class="card__bottom_btns">
                <div class="card__counter">
                    <div class="card__counter_block">
                        <button class="counter__btn counter-minus"><img src="images/icons8-минус-24.png" alt="минус"></button>
                    </div>
                    <div class="card__counter_block">
                        <p class="counter_nums">0</p>
                    </div>
                    <div class="card__counter_block">
                        <button class="counter__btn counter-plus"><img src="images/icons8-плюс-24.png" alt="плюс"></button>
                    </div>
                </div>
                <div class="card__bottom_button">
                    <a href="#" class="add-to-cart bottom__button_item">В корзину</a>
                </div>
            </div>
        </div>

        
    `;
        return card;
    };

    // Загрузка данных из JSON
    fetch("data/products.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Не удалось загрузить данные");
            }
            return response.json();
        })
        .then((products) => {
            allProducts = products; // Сохраняем все товары
            filterProductsByCategory("sushi"); // Показываем товары категории "суши" при загрузке
        })
        .catch((error) => {
            console.error("Ошибка загрузки данных:", error);
        });


    // Обработчик событий для работы с карточками
    productsContainer.addEventListener("click", (event) => {
        const target = event.target;

        // Увеличение количества
        if (target.closest(".counter-plus")) {
            const counter = target.closest(".card__counter").querySelector(".counter_nums");
            let count = parseInt(counter.textContent);
            counter.textContent = count + 1;
        }

        // Уменьшение количества
        if (target.closest(".counter-minus")) {
            const counter = target.closest(".card__counter").querySelector(".counter_nums");
            let count = parseInt(counter.textContent);
            if (count > 0) counter.textContent = count - 1;
        }

        productsContainer.addEventListener("click", (event) => {
            const target = event.target;

            if (target.closest(".disc__btn")) {
                const card = target.closest(".product__card");
                const description = card.dataset.description; // Извлекаем описание
                const discText = document.querySelector(".disc__Text");
                const adress_wrapper = document.querySelector('.dist__wraper');
                const adress_block = document.querySelector('.show__Text');
                const overlay = document.querySelector('.overlay__Text');
                discText.textContent = description; // Обновляем текст
                adress_wrapper.style.display = 'flex';
                setTimeout(() => {
                    overlay.classList.add('show');
                    adress_block.classList.add('show');
                }, 10);
                overlay.addEventListener('click', () => {
                    overlay.classList.remove('show');
                    adress_block.classList.remove('show');
                    setTimeout(() => {
                        adress_wrapper.style.display = 'none';
                    }, 400);
                });
            }
        });
        // Добавление в корзину
        if (target.closest(".add-to-cart")) {
            event.preventDefault(); // Останавливаем стандартное поведение ссылки

            const card = target.closest(".product__card");
            const productId = card.dataset.productId;
            const productName = card.querySelector(".product_name_item").textContent;
            const productPriceText = card.querySelector(".card__price").childNodes[0].textContent;
            const counter = parseInt(card.querySelector(".counter_nums").textContent);
            const image = card.querySelector(".card__image img").src;
            // Преобразуем цену в число
            const productPrice = parseFloat(productPriceText.replace(/\s/g, '').replace('тг', ''));

            // Если цена или количество undefined, то пропускаем товар
            if (!productPrice || counter <= 0) {
                alert("Пожалуйста, проверьте цену и количество товара.");
                return;
            }

            // Добавление товара в корзину
            if (cart[productId]) {
                cart[productId].quantity += counter; // Увеличиваем количество, если товар уже есть в корзине
            } else {

                cart[productId] = {
                    name: productName,
                    price: productPrice,
                    quantity: counter,
                    img: image
                };
            }

            // Сбрасываем счётчик
            card.querySelector(".counter_nums").textContent = "0";

            // Сохраняем корзину в localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Обновляем корзину на странице
            updateCart();

            // Показ уведомления
            showNotification();
        }
    });

    // Функция для обновления корзины
    const updateCart = () => {
        console.log("Корзина:", cart); // Для тестирования: выводим содержимое корзины в консоль
        let totalItems = 0;
        let totalPrice = 0;

        // Подсчёт общей суммы и количества
        for (const productId in cart) {
            if (cart[productId].price && cart[productId].quantity) {
                totalItems += cart[productId].quantity;
                totalPrice += cart[productId].price * cart[productId].quantity;
            }
        }

        // Обновление UI корзины
        const cartSummary = document.querySelector(".cart-summary");
        if (cartSummary) {
            cartSummary.textContent = `Товаров: ${totalItems}, Сумма: ${totalPrice} тг`;
        }

        // Отображение всех товаров в корзине (если нужно)
        const cartDetails = document.querySelector(".cart-details");
        if (cartDetails) {
            cartDetails.innerHTML = ''; // Очищаем предыдущие данные
            for (const productId in cart) {
                const product = cart[productId];
                const item = document.createElement("div");
                item.className = "cart-item";
                item.innerHTML = `
                    <div>${product.img}</div>
                    <div>${product.name}</div>
                    <div>Цена: ${product.price} тг</div>
                    <div>Количество: ${product.quantity}</div>
                    <div>Итого: ${product.price * product.quantity} тг</div>
                `;
                cartDetails.appendChild(item);
            }
        }
    };

    // Функция для показа уведомления
    const showNotification = () => {
        const notification = document.getElementById("notification");
        notification.style.display = "block";
        notification.style.opacity = "1";

        // Скрыть уведомление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.style.display = "none";
            }, 300); // Время, чтобы исчезло с анимацией
        }, 3000);
    };

    // Инициализация корзины на старте страницы
    updateCart();
});