document.addEventListener('DOMContentLoaded', () => {
    const infoBtns = document.querySelectorAll('.nav-btn'); // Все кнопки с классом .info-btn
    const adress_block = document.querySelector('.show-info-adress');
    const adress_h1 = document.querySelector('.show-info-adress-h1');
    const adress_p = document.querySelector('.show-info-adress-p');
    const adress_wrapper = document.querySelector('.info_wrapper');
    const overlay = document.querySelector('.overlay');

    // Обработчик событий для всех кнопок
    infoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const infoType = btn.dataset.infoType; // Получаем тип информации из data-атрибута кнопки

            // В зависимости от типа информации меняем содержимое
            switch (infoType) {
                case 'adress':
                    adress_h1.innerHTML = 'Адрес';
                    adress_p.innerHTML = 'Актобе, 11 мкр, БЦ Асан, ул. Аз Наурыз, 17';
                    break;
                case 'delivery':
                    adress_h1.innerHTML = 'Доставка';
                    adress_p.innerHTML = 'Бесплатная доставка за 1 час от 10 000 тг.';
                    break;
                case 'pay':
                    adress_h1.innerHTML = 'Оплата';
                    adress_p.innerHTML = 'Наличными или QR Kaspi Red';
                    break;
                case 'contacts':
                    adress_h1.innerHTML = 'Контакты';
                    adress_p.innerHTML = '+7 (708) 471-03-00';
                    break;
            }

            // Показываем блок с информацией
            adress_wrapper.style.display = 'flex';
            setTimeout(() => {
                overlay.classList.add('show');
                adress_block.classList.add('show');
            }, 10);
        });
    });

    // Закрытие окна при клике на overlay
    overlay.addEventListener('click', () => {
        overlay.classList.remove('show');
        adress_block.classList.remove('show');
        setTimeout(() => {
            adress_wrapper.style.display = 'none';
        }, 400);
    });
});

//hamburger menu system
const hamMenu = document.querySelector('.ham_Btn');
const cross = document.querySelector('.cross');
const offSeenMenu = document.querySelector('.off_screen_menu');

hamMenu.addEventListener('click', () => {
    offSeenMenu.classList.remove('hide');
    offSeenMenu.classList.toggle('active');

})


cross.addEventListener('click', () => {
    offSeenMenu.classList.remove('active');
    offSeenMenu.classList.toggle('hide');
})

// scroll system
let mybutton = document.getElementById("myBtn");
let checkout__btn = document.getElementById("checkout__btn");
// Show or hide the button on scrolllet mybutton = document.getElementById("myBtn");

// Отслеживаем событие прокрутки
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.classList.add("show");
        checkout__btn.classList.add("show");
    } else {
        mybutton.classList.remove("show");
        checkout__btn.classList.remove("show");
    }
}

// Плавный переход наверх
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

//slider


document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const slides = slider.querySelectorAll("img");
    let currentIndex = 0;

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
         // Индекс следующего слайда
        slider.scrollTo({
            left: slider.offsetWidth * currentIndex,
            behavior: "smooth", // Плавный переход
        });
    }

    // Автоматическое пролистывание каждые 3 секунды
    setInterval(nextSlide, 6000);
});
