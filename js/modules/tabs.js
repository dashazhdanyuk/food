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