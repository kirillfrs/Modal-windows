import { closeModal, openModal } from './modalWindow';
import { postData } from '../services/services';

function createForm(formSelector, modalTimerId) {
    //forms
    const form = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        succes: 'Спасибо,мы скоро с вами свяжемся',
        failure: 'Что-то пошло не так..'
    };

    form.forEach(item => {
        bindpostData(item);
    });



    function bindpostData(form) {
        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
        display:block;
        margin:0 auto;
        `;

            form.insertAdjacentElement('afterend', statusMessage);



            const formData = new FormData(form);

            // перевод в джейсон форм дату
            const json = JSON.stringify(Object.fromEntries(formData.entries()));


            // const obj = {};

            // перебор формдаты и запись в пустой обьект
            // formData.forEach(function (value, key) {
            //     obj[key] = value;
            // });



            // создаем json(конвертируем в джейсон)
            // const json = JSON.stringify(obj);

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.succes);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
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
    <div class="modal__content">
    <div data-close class="modal__close">&times;</div>
    <div class="modal__title"> ${message}</div>
    </div>
    `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000);
    }

}

export default createForm;
