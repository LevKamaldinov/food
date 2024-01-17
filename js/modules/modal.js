    // чтобы модальное окно не октрывалось повторно в сценарии, когда сперва пользователь сам открыл модальное окно, а потом сайт ему повторно открыл это окно,
    // в функции openModal предусмотрим отключение таймера
function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden'; // теперь при открытии модального окна страница не будет прокручиваться

    // пропишем условие, что отключение таймера будет только тогда, когда вообще есть запуск таймера
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // теперь, когда модальное окно закрывается, страница вновь может прокручиваться
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    // Цель: создать модальное окно, которое будет отображаться при нажатии на кнопки "связаться с нами"
    // Задачи:
    // 1. Прописать код, который будет делать блок с модальным окном видимым (он уже создан в HTML, но в CSS у него стоит в display none, т.е. его не видно)
    // 2. Прописать код, который будет закрывать модальное окно
    // для начала, в HTML-файле, в нужных нам кнопках создадим триггер с помощью data-атрибута, например, data-modal, теперь мы отметили кнопки, чтобы в дальнейшем их лего было найти для работы в JS
    // также введём data-атрибут для закрытия модального окна, например, data-close

    const btnModal = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);

    // мой код, здесь чисто открывание и закрывание модального окна
    // btnModal.forEach(el => {
    //     el.addEventListener('click', () => {
    //         modal.style.display = 'block';
    //     });
    // });

    // btnClose.forEach(el => {
    //     el.addEventListener('click', () => {
    //         modal.style.display = 'none';
    //     });
    // });

    // код преподавателя
    // для реализации этого кода пришлось в CSS-файл добавить класс hide, который скрывает элемент, и класс show, который показывает элемент
    // чтобы во время того, как модальное окно открыто, остальная страница не прокручивалась (не скроллилась), вручную будем менять CSS стиль,
    // который отвечает за прокрутку - overflow

    btnModal.forEach(el => {
        el.addEventListener('click', () => openModal(modalSelector, modalTimerId)); // мы оборачиваем нужную функцию в анонимную, потому что, если мы сразу укажем нужную функцию с аргументом, 
        // это будет означать её вызов, а нам не надо вызывать функцию в данном синтаксисе, а надо просто указать, какая функция сработает, когда сработает обработчик событий
    });

    // альтернативный код с использование toggle
    // btnModal.forEach(el => {
    //     el.addEventListener('click', () => {
    //         modal.classList.toggle('show');
    //         document.body.style.overflow = 'hidden'; 
    //     });
    // });
    // btnClose.forEach(el => {
    //     el.addEventListener('click', () => {
    //         modal.classList.toggle('show');
    //         document.body.style.overflow = ''; 
    //     });
    // });
    
    // пропишем код, чтобы модальное окно закрывалось, когда пользователь нажмёт на подложку (зона вне модального окна)
    // чтобы реализовать это, нужно отследить, куда нажимает пользователь, он должен кликать не на зону модального окна, а на иную часть
    // в HTML всё, что вне модального окна, относится к родительскому элементу, который мы обозначили как modal

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.getAttribute('data-close') == '') { // если пользователь кликнул на зону вне модального окна или на крестик, оно закроется
            closeModal(modalSelector);
        }
    });

    // пропишем код, чтобы модальное окно закрывалось, когда пользователь нажмёт на кнопку esc
    // для этого используем событие keydown, которое отслеживает нажатие клавиатуры,
    // чтобы отследить нажатие именно клавиатуры, используем такое свойство event, как code
    // так как нажатие клавиши не связано с зоной видимости элементов/страницы, её навешиваем на весь документ сразу
    // также предусмотрим проверку не только нажатия кнопки esc, но и открыто ли модальное окно, чтобы событие, привязанное к esc, срабатывало только при открытом модальном окне
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    // Дополнительная задача:
    // 1. Прописать код, чтобы модальное окно открывалось автоматически, когда пользователь прокручивает страницу до конца
    // 2. Прописать код, чтобы модальное окно открывалось автоматически через определённый промежуток времени
    
    //Мой код
    // const modalTimerId = setTimeout(openModal, 3000); // модальное окно открывается после заданного времени
    // этот код перенесли в основной js файл в качестве глобальной переменной, т.к. она используется и в модуле с модальными окнами, и в модуле с формами

    // код преподавателя
    //пропишем код, чтобы при прокручивании страницы до конца открывалось модальное окно
    //window.pageYOffset показывает, сколько прокрутилось по вертикали
    //document.documentElement.clientHeight показывает видимый размер элемента
    //document.documentElement.scrollHeight показывает общий размер прокрутки
    // если видимый размер элемента + то, сколько уже прокрутилось, равно или больше общего размера прокрутки, значит, пользователь дошёл до конца прокрутки страницы
    // в некоторых браузерах может не срабатывать этот код по техническим причинам, в этом случае рекомендуется использовать document.documentElement.scrollHeight - 1
    // чтобы модальное окно не вылазило каждый раз, когда прокрутка страницы заканчивается, можно предусмотреть однократное срабатывание, но в данном случае оно не подходит, 
    // так как обработчик привязан к прокручиванию, даже если на пиксель прокрутится страница, но до конца не дойдёт, код уже не сработает, поэтому лучше предусмотреть удаление обработчика событий

    function showModalbyScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalbyScroll);
        }
    }

    window.addEventListener('scroll', showModalbyScroll);
}

export default modal;

export {closeModal};
export {openModal};