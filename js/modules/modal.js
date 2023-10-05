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