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
});