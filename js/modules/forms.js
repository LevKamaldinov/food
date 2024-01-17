import {closeModal, openModal} from "./modal";
import {postData} from "../services/services";

function forms(formSelector) {
    // Цель: реализовать скрипт отправки данных на сервер, кт пользователь заполняет и отправляет кнопкой "Перезвонить мне" без перезагрузки страницы
    // Задачи:
    // 1. Создать функцию, которая будет брать введённые данные и отправлять их серверу
    
    // объявим переменные

    const forms = document.querySelectorAll(formSelector); // это переменная для обозначения всех форм, которые заполняет пользователь и отправляет кнопкой "Перезвонить мне"
    
    const message = { // этот объект будет содержать в себе все фразы, которые должны будут выводиться пользователю в зависимости от того, успешно отправились данные серверу или нет (при нажатии кнопки "Перезвонить мне")
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    // ниже есть функция по отправке данных на сервер, здесь же пропишем перебор всех наших форм, чтобы при отправки любой из форм срабатывала наша функция

    forms.forEach(item => {
        bindPostData(item);
    });

    // создадим переменную функцию по отправке запроса на сервер, чтобы такую функцию можно было использовать неоднократно и не писать большой код каждый раз
    // такую функцию мы выделили в отдельный js-файл в папке services, потому что эта функция фактически универсальна и может использоваться в любом модуле
    // тут была функция postData

    // пропишем функцию по отправке данных на сервер
    // это вариант с отправкой FormData
    // function bindPostData(form) { // в качестве параметра передаём форму, потому что на неё легко навесить нужный нам обработчик событий
    //     form.addEventListener('submit', (e) => { // событие submit срабатывает каждый раз, когда пользователь отправляет форму
    //         e.preventDefault(); // используем, чтобы не сработал встроенный сценарий - перезагрузка страницы

    //         // чтобы взаимодействовать с пользователем, предусмотрим, что когда он нажимает кнопку, чтобы отправить данные, ему выходило промежуточное сообщение, что идёт загрузка данных
    //         const statusMessage = document.createElement('img');
    //         statusMessage.src = message.loading;
    //         statusMessage.style.cssText = `
    //             display: block;
    //             margin: 0 auto;
    //         `;

    //         form.insertAdjacentElement('afterend', statusMessage);

    //         // так как в HTML обычной для заполнения используют form, в JS для этого существует специальный объект, который можно использовать для передачи данных серверу
    //         const formData = new FormData(form);

    //         // создадим fetch запрос
    //         fetch('server.php', {
    //             method: 'POST',
    //             body: formData
    //         })
    //         .then(data => data.text()) // data это те данные, что вернутся от сервера, их нужно преобразовать в удобный для нас формат
    //         .then(data => { 
    //             console.log(data);
    //             showThanksModal(message.success);  
    //             statusMessage.remove();
    //         })
    //         .catch(() => {
    //             showThanksModal(message.failure); 
    //         })
    //         .finally(() => {
    //             form.reset();
    //         })
    //     }); 
    // }

    // это вариант с итоговой отправкой не FormData, а JSON-строки
    function bindPostData(form) {
        form.addEventListener('submit', (e) => { 
            e.preventDefault(); 

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json) // обращаемся к json-server
             // т.к. fetch возвращает промис, то через then пропишем код, который вернётся в случае успешной отправки данных на сервер
            .then(data => { // data это те данные, что вернутся от сервера
                console.log(data);
                showThanksModal(message.success); 
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure); 
            }).finally(() => {
                form.reset(); 
            })
            
        }); 
    }

    //пропишем функцию, которая при успешной отправке данных пользователя будет создавать новое наполнение модального окна и будет показывать это наполнение пользователю
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog'); // получаем элемент, который будет заменяться на вновь созданный

        prevModalDialog.classList.add('hide'); // в случае успешной отправки данных пользователя, изначальное наполнение модального окна будет скрыто
        // openModal('.modal', modalTimerId); // заново открываем само модальное окно

        const thanksModal = document.createElement('div'); // создаём элемент, которым будет заменяться прежнее содержание модального окна
        thanksModal.classList.add('.modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal); // добавляем созданный блок в HTML
        // после того, как данные отправились и пользователь увидел новое содержание модального окна, 
        // модальное окно нужно вернуть в прежнее состояние, чтобы при его новом открытии пользователь видел форму для заполнения, а не сообщение, что всё отправлено
        setTimeout(() => { // через какое-то время наша функция сама обновит содержимое модального окна
            thanksModal.remove(); // удаляем блок с уведомлением
            prevModalDialog.classList.remove('hide');
            closeModal('.modal'); // закрываем модальное окно
        }, 4000);

    }
}

export default forms;