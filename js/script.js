window.addEventListener('DOMContentLoaded', () => {

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



        return await res.json(); 
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            })
        })


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

});