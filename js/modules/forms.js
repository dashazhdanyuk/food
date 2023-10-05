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