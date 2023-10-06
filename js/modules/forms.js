import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimerId) {
    //forms 

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading : 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

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
        openModal('.modal', modalTimerId);

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
            closeModal('.modal');
        }, 4000);
    }

    /* fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res)); */
}

export default forms;