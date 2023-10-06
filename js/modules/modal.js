function openModal(modalSelector, modalTimerId) { //вынесли в функцию код, который повторяется в коде больше одного раза don`t repeat yourself (dry)
    /* modal.style.display = 'block'; */
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden'; //стиль который запрещает прокрутку страницы, когда модальное окно открыто
    console.log(modalTimerId);
    if(modalTimerId){
        clearInterval(modalTimerId); //если пользователь сам откроет окно, то окно не откроется само через некоторое время 
    };
}

function closeModal(modalSelector) { //вынесли в функцию код, который повторяется в коде больше одного раза don`t repeat yourself (dry)
    /*  modal.style.display = 'none'; */
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = ''; //браузер сам подставит дефoлтное значение
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    //Modal

    const btn = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);

    btn.forEach( btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId)); //в обработчике событий не нужно вызывать колбэк функцию, но так как мы не хотим жестко задать функции селектор (openModal(modalSelector)), обходим это, делая стрелочную функцию
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close') == '') { //если пользлватель кликает на подложку (за пределы модального окна, то окно закрывается), то есть если клик пользователя равно подложке modal, то окно скроется
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => { //закрытие модального окна при нажатии на esc
        if (e.code === 'Escape' && modal.classList.contains('show')) { //если пользователь нажал на esc и модальное окно открыто
            closeModal();
        }
    });

    function showModalByScroll() { //функционал, который открывает модальное окно в случае прокрутки сайта до конца страницы 
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) { //если прокрученная часть + видимая часть на экране юзера = высоте всей прокрутки (смотреть таблицу в тетради) 
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);//модальное окно должно включаться только один разб когда пользовательно прокручивает страицу до конца (а не каждый раз, когда прокручивает до конца сайта)
        }
    } 

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {closeModal};
export {openModal};