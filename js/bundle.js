/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {
    //Calc

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if(localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else{
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if(localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else{
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initlocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach( elem => {
            elem.classList.remove(activeClass);

            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            } 
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
        });
    }

    initlocalSettings('#gender div', 'calculating__choose-item_active');
    initlocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if(!sex || !height || !weight || ! age || ! ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass){ //функция для дивов активности и выбора male/female
        const elements = document.querySelectorAll(selector); //получаем все дивы с этим классом

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => { //делегирование событий 
                if(e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio'); //если дивы имеют дата-атрибут с активностью, то собираем с них коеф активности, который указан в дата-аторибуте каждого дива с активностью
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
    
                console.log(ratio, sex);
    
                //назначаем класс активности (сначала убираем активность у всех)
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass); //назначаем класс активности диву, в который кликнули
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            }else{
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')){
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards(){
    //используем классы для карточек

    class MenuCard {
        constructor (src, alt, title, descr, price, parentSeletor, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSeletor); //пушим наш новый элемент в родителя parentSelector
            this.transfer = 27; //курс валют, чтобы перевести гривны в доллары
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render () {
            const element = document.createElement('div');
            
            if(this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `; //создали верстку карты

            this.parent.append(element); //вставляет узлы в конец parent
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }


        return await res.json(); 
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
           });
        });
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
    //forms 

    const forms = document.querySelectorAll('form');

    const message = {
        loading : 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json' //заголовок запроса
            }, 
            body: data
        });

        return await res.json(); //возвращаем промис. сначала дожидаемся результата промиса,  а потом возвращаем его (return)
        // так как это асинхронный код, сначала будет выполняться fetch, а потом результат присваиваться переменной res. если обещание еще не выполнилось, то в перменную присвоится undefined и будет ошибка. нам нужно сделать асинхронный код синхронным (async) - мы указали, что код в функции будет асинхронным, await мы ставим перед операциями, которые надо дождаться
    };

    function bindPostData(form) { //привязка постинга
        form.addEventListener ('submit', (e) => {
            e.preventDefault(); //эта окманда используется первой в аджакс запросах

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            //инлайн стили
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form); //взяли данные из HTML-формы и отправить их с помощью fetch или другого метода для работы с сетью.

            const json = JSON.stringify(Object.fromEntries(formData.entries())); //FormData специфический объект поэтому надо сделать его обычным с помощью перебора значений 
            //сначала formData превращаем в массив массивов (formData.entries()), потом превращаем ее в классический объект (Object.fromEntries()), после этого классический объект превращаем в json (JSON.stringify())

            postData('http://localhost:3000/requests', json)
            .then (data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch (() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset(); //очистили форму
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class = "modal__content">
                <div class = "modal__close" data-close>×</div>
                <div class = "modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal); //отображаем на странице модальное окно благодарности
        //через 4 секунды удаляем модальное окно благодарности, чтобы пользователь мог повторно отправить форму
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
    //Modal

    const btn = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    btn.forEach( btn => {
        btn.addEventListener('click', openModal);
    })

    function openModal() { //вынесли в функцию код, который повторяется в коде больше одного раза don`t repeat yourself (dry)
        /* modal.style.display = 'block'; */
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; //стиль который запрещает прокрутку страницы, когда модальное окно открыто
        clearInterval(modalTimerId); //если пользователь сам откроет окно, то окно не откроется само через некоторое время 
    }

    function closeModal() { //вынесли в функцию код, который повторяется в коде больше одного раза don`t repeat yourself (dry)
       /*  modal.style.display = 'none'; */
       modal.classList.add('hide');
       modal.classList.remove('show');
        document.body.style.overflow = ''; //браузер сам подставит дефoлтное значение
    }

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close') == '') { //если пользлватель кликает на подложку (за пределы модального окна, то окно закрывается), то есть если клик пользователя равно подложке modal, то окно скроется
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => { //закрытие модального окна при нажатии на esc
        if (e.code === 'Escape' && modal.classList.contains('show')) { //если пользователь нажал на esc и модальное окно открыто
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000); //открывается модальное окно через 5 секунд перебывания пользователя на сайте 

    function showModalByScroll() { //функционал, который открывает модальное окно в случае прокрутки сайта до конца страницы 
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) { //если прокрученная часть + видимая часть на экране юзера = высоте всей прокрутки (смотреть таблицу в тетради) 
            openModal();
            window.removeEventListener('scroll', showModalByScroll);//модальное окно должно включаться только один разб когда пользовательно прокручивает страицу до конца (а не каждый раз, когда прокручивает до конца сайта)
        }
    } 

    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
    //slider

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width; //взяли ширину обертки из стилей окна
    let slideIndex = 1; // Индекс текущего слайда
    let offset = 0; //для того чтобы понимать на сколько мы отступили вправо/влево

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else{
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%'; //все слайды, которые есть на странице поместили в slidesField
    slidesField.style.display = 'flex'; //поставили все слайды в строку
    slidesField.style.transition = '0.5s all'; 

    slidesWrapper.style.overflow = 'hidden'; // скрыли слайды, которые не должны попадать в область видимости

    slides.forEach( slide => {
        slide.style.width = width;
    }); //все слайды будут одной фиксированной ширины

    slider.style.position = 'relative'; //точки будут прикреплены к слайдеру

    const indicators = document.createElement('ol'), //wrapper for dots
          dots = [];
          
    indicators.classList.add('carousel-indicators'); 
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;

    slider.append(indicators); //past this block of wrapper

    for (let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+1); //i+1 для нумерации слайдов, начиная с первого
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if(i == 0) {
            dot.style.opacity = 1;
        } //for first slide opacity = 1, but other dots will be 0.5

        indicators.append(dot);
        dots.push(dot);
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    next.addEventListener('click', () => {
        if(offset == deleteNotDigits(width) * (slides.length - 1)){ //'500px' - пример переменной width, поэтому нужно обработать ее, чтобы это значение было число без px
            offset = 0; //если слайдер долистать до конца, то он возвращается на первый слайд
        } else {
            offset += deleteNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex -1].style.opacity = 1;
    });

    prev.addEventListener('click', () => {
        if(offset == 0){ 
            offset = deleteNotDigits(width) * (slides.length -1);
        } else {
            offset -= deleteNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex -1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex =  slideTo; //устанавливаем в позицию слайдТу (кликнули на 4 точку, значит 4 слайд отобразился)
            offset =  deleteNotDigits(width) * (slideTo -1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex -1].style.opacity = 1;
        });
    });
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
    //tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent  = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide'); /* здесь мы скрыли абсолютно все табы */
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    /* если в функцию не передается аргумент, то по умолчанию будет стоять 0 (первый элемент) */
    function showtabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent();
    showtabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        /* проверяем или сущетсвует таргет и нажимаем ли мы точно на текст, а не на пустое пространство */
        /* если таргет равно айтем (если таб, по которому кликнули совпадает с элементом, который сейчас перебирается), то будут выполняться функции */
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach ((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showtabContent(i);
                }
            });
        }
    });
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
    //timer

    const deadline = '2023-09-01';
    
    function getTimeRemainig(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date()) //получаем кол-во миллисекунд

        if(t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
              days = Math.floor(t / (1000*60*60*24)), //Math.floor - округлит значение
              hours = Math.floor((t / (1000*60*60) % 24)),
              minutes = Math.floor((t / 1000/ 60) % 60),
              seconds = Math.floor((t / 1000 ) % 60);
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {  //добавляет ноль в числа состоящие из одной цифры 2023-01-01
        if(num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock(); //исправили "моргающую" верстку на таймере при обновлении страницы"

        function updateClock() {
            const t = getTimeRemainig(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {
    // используем синтаксис commonJS
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");

    tabs();
    modal();
    timer();
    cards();
    calc();
    slider();
    forms();

});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map