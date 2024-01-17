/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function calc() {
  // Цель: создать калькулятор калорий на сайте
  // Задачи:
  // 1. Создать функцию, которая будет видеть, какой из выбранных вариантов активный, и передавать соответствующее значение в итоговую формулу
  // 2. Создать код, который будет передавать вводимые пользователем данные в итоговую формулу
  // 3. Создать итоговую формулу расчёта калорий
  // 4. Предусмотреть сохранение ранее введённых пользователем данных в localStorage

  // для начала, в html-файле добавили id кнопкам выбора пола мужчины или женщины
  // Затем посмотрим на общую формулу подсчёта калорий на случай, если вдруг нужны будут дополнительные данные, которые не указываются на сайте
  // формула расчёта базовой нормы калорий
  // для мужчин: BMR = 88.36 + (13.4 x вес, кг) + (4.8 х рост, см) – (5.7 х возраст, лет)
  // для женщин: BMR = 447.6 + (9.2 x вес, кг) + (3.1 х рост, cм) – (4.3 х возраст, лет)
  // коэффициент дневной активности:
  // Минимальный уровень активности — 1.2
  // Низкий уровень активности — 1.375
  // Средний уровень активности — 1.55
  // Высокий уровень — 1.725
  // Очень высокий —  1.9
  // Норма калорий = BMR x Уровень активности

  // поскольку у уровней дневной активности фиксированные значения, их можно ввести как переменные или как data-атрибуты соответствующих кнопок выбора в html-файле

  const result = document.querySelector('.calculating__result span'); // это то поле, где на странице выводится итог расчёта калорий

  let sex, height, weight, age, ratio; // это переменные, которые являются частью формулы расчёта калорий

  // т.к. мы используем сохранённые в localStorage данные, сделаем проверку, что если в хранилище есть сохранённые данные, то при новой загрузке будут подсвечены сохранённые значения
  // если хранилище пусто, то используем значения переменных по умолчаниию (начальные значения, которые по замыслу дизайнера при открытии страницы подсвечены как бы по умолчанию)
  if (localStorage.getItem('sex')) {
    // если в хранилище есть сохранённые данные
    sex = localStorage.getItem('sex'); // значение пола подтягивается из хранилища
  } else {
    sex = 'female'; // иначе устанавливается начальное значение пола
    localStorage.setItem('sex', 'female'); // которое сохраняется в хранилище
  }
  // то же самое прописываем для активности
  if (localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio');
  } else {
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375);
  }

  // создадим функцию, которая будет запускаться при первом открытии сайта и подсвечивать данные, взятые из localStorage, если такие имеются
  function initLocalSettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector); // это все дивы с вариантами выбора
    // переберём дивы, чтобы сперва очистить все от классов активности
    // а затем класс активности присвоить тому варианту (диву), значение которого совпадёт со значением, сохранённым в localStorage
    elements.forEach(elem => {
      elem.classList.remove(activeClass);
      if (elem.getAttribute('id') === localStorage.getItem('sex')) {
        // когда во время перебора будет найден элемент со значением пола, совпадающим с хранилищем, ему будет присвоен класс активности
        elem.classList.add(activeClass);
      }
      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        // когда во время перебора будет найден элемент со значением активности, совпадающим с хранилищем, ему будет присвоен класс активности
        elem.classList.add(activeClass);
      }
    });
  }
  // инициализируем функцию для каждого инпута
  initLocalSettings('#gender div', 'calculating__choose-item_active');
  initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

  // пропишем общую формулу расчёта калорий, делаем в виде функции, потому что она будет вызываться при каждом изменении того или иного поля на сайте
  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      // сперва нужно делать проверку, что все поля заполнены, делаем через оператор отрицания (если чего-то нет, сработает if)
      result.textContent = '____'; // пользователь будет уведомлен, что что-то не так сделано
      return; // выполнение фукнции на этом прекратиться
    }

    if (sex === 'female') {
      // пропишем формулу расчёта для женщин
      result.textContent = Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);
    } else {
      // пропишем формулу расчёта для мужчин
      result.textContent = Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
    }
  }
  // инициализируем функцию, чтобы на странице при загрузке страницы было показано, что не все поля заполнены
  calcTotal();

  // пропишем функцию, которая будет отслеживать, какое из предложенных значений будет выбрано пользователем
  // этот блок кода будет работать для выбора пола и уровня активности (там пользователь просто выбирает, ничего не вводит)
  // для выбранного варианта надо также предусмотреть смену класса активности, это будет подсвечивать выбранный вариант зелёным
  function getStaticInformation(selector, activeClass) {
    const elements = document.querySelectorAll(selector); // сперва функция получает все дивы с вариантами, которые выбирает пользователь
    // используем перебор дивов с вариантами, которые выбирает пользователь
    elements.forEach(elem => {
      elem.addEventListener('click', e => {
        // данная функция работает с двумя блоками выборов: выбор пола и активности, но у дивов этих блоков разные атрибуты, которые функция будет вытягивать при выборе пользователя
        // поэтому надо предусмотреть, что если у выбранного элемента есть data-атрибут (он предусмотрен для активности), то функция будет вытягивать такой атрибут, если его нет, функция будет вытягивать id (это предусмотрено для пола)
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
          localStorage.setItem('ratio', +e.target.getAttribute('data-ratio')); // сохраняем в localStorage введённые пользователем данные
        } else {
          sex = e.target.getAttribute('id');
          localStorage.setItem('sex', e.target.getAttribute('id')); // сохраняем в localStorage введённые пользователем данные
        }

        // предусмотрим смену класса активности у выбранного элемента
        elements.forEach(elem => {
          // сперва у всех дивов внутри родительского элемента убираем класс активности
          elem.classList.remove(activeClass);
        });
        e.target.classList.add(activeClass); // затем выбранной кнопке добавляем класс активности

        calcTotal(); // вызываем функцию, чтобы автоматически пересчитывался расчёт калорий
      });
    });
  }

  ;
  // теперь вызовем данную функцию сперва для блока с выбором пола, у него есть свой id, по нему и вызовем функциб
  getStaticInformation('#gender div', 'calculating__choose-item_active');
  // затем для блока с выбором активности
  getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

  // теперь создадим функцию, которая будет вытягивать данные из инпутов - полей, заполненных пользователям
  // функция будет одна, но вызываться для каждого инпута
  function getDynamicInformation(selector) {
    // функция будет принимать аргументом селектор, позволяющий определить, из какого поля будет браться информация (веса, роста или возраста в нашем случае)
    const input = document.querySelector(selector);
    input.addEventListener('input', () => {
      // будет срабатывать при каждом изменении ввода пользователем
      // сперва делаем проверку того, правильно ли пользователь вводит данные (дб только цифры)
      if (input.value.match(/\D/g)) {
        // если пользователь вводит нечисловые символы, его предупредят о недопустимости подобного, в данном случае это делается обводкой красным, а мб сообщением или ещё как
        input.style.border = '1px solid red'; // поле ввода будет обведено красным
      } else {
        // если всё нормально, поле ввода станет обычного цвета
        input.style.border = 'none';
      }
      // т.к. функция едина на три варианта данных (возраст, вест, рост), она должна понимать, с каким именно полем она работает, для этого используем switch case и id
      switch (input.getAttribute('id')) {
        // свитч проверяет, какой атрибут у поля, куда вводит данные пользователь
        case 'height':
          // если это рост
          height = +input.value; // значение данного поля присваивается переменной роста
          break;
        // затем код заканчивает работу
        case 'weight':
          // та же логика с весом
          weight = +input.value;
          break;
        case 'age':
          // та же логика с ростом
          age = +input.value;
          break;
      }
      ;
      calcTotal(); // вызываем функцию, чтобы автоматически пересчитывался расчёт калорий
    });
  }

  ;
  // теперь вызовем функцию с каждым инпутом
  getDynamicInformation('#height');
  getDynamicInformation('#weight');
  getDynamicInformation('#age');
}
/* harmony default export */ __webpack_exports__["default"] = (calc);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");

function cards() {
  // Задачи по этому проекту:
  // Цель: создать шаблон создания карточек с выбором питания и ценой
  // Задачи:
  // 1. Создать класс карточек
  // 2. Прописать код, который будет создавать карточки с едой динамически

  //Мой код
  // в своём решении я отдельно создаю класс как объект с определёнными свойствами, а также отдельно функцию, которая
  // будет создавать элемент вёрстки, используя свойства и значения объекта класса
  // в конце я вручную вызову функцию и тем самым создам три элемента
  // в решени преподавателя функция по созданию вёрстки прописывается как один из методов класса, что даёт тот же результат, 
  // но лаконичнее по итогу и универсальнее в будущем 

  // const allMenu = document.querySelectorAll('.menu__item');

  // allMenu.forEach(el => {
  //     el.remove();
  // });

  // class Div {
  //     constructor(img, alt, type, description, price) {
  //         this.img = img;
  //         this.alt = alt;
  //         this.type = type;
  //         this.description = description;
  //         this.price = price;
  //     }
  // }

  // const vegy = new Div('img/tabs/vegy.jpg', 'vegy', 'Фитнес', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 229),
  //       elite = new Div('img/tabs/elite.jpg', 'elite', 'Премиум', 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', 550),
  //       post = new Div('img/tabs/post.jpg', 'post', 'Постное', 'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.', 430);

  // function createNewDiv(obj) {
  //     const menu = document.querySelector('[data-class]')
  //     let div = document.createElement('div');
  //     div.classList.add('menu__item');
  //     div.innerHTML = `
  //     <img src=${obj.img} alt=${obj.alt} />
  //     <h3 class="menu__item-subtitle">Меню "${obj.type}"</h3>
  //     <div class="menu__item-descr">
  //         ${obj.description}
  //     </div>
  //     <div class="menu__item-divider"></div>
  //     <div class="menu__item-price">
  //         <div class="menu__item-cost">Цена:</div>
  //         <div class="menu__item-total"><span>${obj.price}</span> грн/день</div>
  //     </div>
  //     `;
  //     menu.append(div);
  // };

  // createNewDiv(vegy);
  // createNewDiv(elite);
  // createNewDiv(post);

  // код преподавателя
  // создаём класс (шаблон карточек меню)
  // в данной версии будет применён rest оператор на случай, если в будущем при создании элемента захочется указать какие-либо классы
  class MenuCard {
    constructor(img, altimg, title, descr, price, parentSelector) {
      this.img = img;
      this.altimg = altimg;
      this.title = title;
      this.descr = descr;
      this.price = price;
      for (var _len = arguments.length, classes = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
        classes[_key - 6] = arguments[_key];
      }
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27; // указываем курс, по кт доллары будут переводиться в гривны
      this.changeToUAH(); // при создании объекта создадуться свойства и сразу будет вызван метод, который переведёт доллары в гривны
    }
    // создаём метод для конвертации долларов в гривны
    changeToUAH() {
      this.price = this.price * this.transfer;
    } // его можно вызвать или на этапе вёрстки (метод render), или в конструкторе
    // создаём метод, который будет создавать нужную нам вёрстку
    render() {
      let element = document.createElement('div');
      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      element.innerHTML = ` 
                <img src=${this.img} alt=${this.altimg} />
                <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
                <div class="menu__item-descr">
                    ${this.descr}
                </div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
      this.parent.append(element);
    }
  }

  // создадим функцию, которая будет запрашивать данные у сервера и на их основе формировать карточки меню
  // мы поместили эту функцию в папку services, потому что эта функция универсальна и может использоваться в любом модуле
  // тут была функция getResource

  // Обычный вариант кода
  (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResource)('http://localhost:3000/menu') // обращаемся к серверу за данными
  .then(data => {
    // полученные от сервера данные в виде массива перебираем, превращая каждый элемент в карточку меню
    data.forEach(_ref => {
      let {
        img,
        altimg,
        title,
        descr,
        price
      } = _ref;
      // используем деструктуризацию, чтобы меньше писать в аргументах new MenuCard
      new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    });
  });

  // Альтернативный вариант кода с использованием axios-библиотеки
  // axios.get('http://localhost:3000/menu')
  // .then(data => {
  //     data.data.forEach(({img, altimg, title, descr, price}) => { // data повторяется дважды, потому что axios возвращает объект (который в функции обозначен как data) со свойством data
  //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
  //     });
  // });

  // Альтернативный вариант кода по созданию карточек меню, он приемлем, когда нужно разово что-то создать
  // getResource('http://localhost:3000/menu')
  //     .then(data => createCard(data));

  // function createCard(data) {
  //     data.forEach(({img, altimg, title, descr, price}) => {
  //         const element = document.createElement('div');

  //         element.classList.add('menu__item');

  //         element.innerHTML = ` 
  //             <img src=${img} alt=${altimg} />
  //             <h3 class="menu__item-subtitle">Меню "${title}"</h3>
  //             <div class="menu__item-descr">
  //                 ${descr}
  //             </div>
  //             <div class="menu__item-divider"></div>
  //             <div class="menu__item-price">
  //                 <div class="menu__item-cost">Цена:</div>
  //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
  //             </div>
  //         `; 

  //         document.querySelector('.menu .container').append(element);
  //     })
  // }
}

/* harmony default export */ __webpack_exports__["default"] = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function forms(formSelector) {
  // Цель: реализовать скрипт отправки данных на сервер, кт пользователь заполняет и отправляет кнопкой "Перезвонить мне" без перезагрузки страницы
  // Задачи:
  // 1. Создать функцию, которая будет брать введённые данные и отправлять их серверу

  // объявим переменные

  const forms = document.querySelectorAll(formSelector); // это переменная для обозначения всех форм, которые заполняет пользователь и отправляет кнопкой "Перезвонить мне"

  const message = {
    // этот объект будет содержать в себе все фразы, которые должны будут выводиться пользователю в зависимости от того, успешно отправились данные серверу или нет (при нажатии кнопки "Перезвонить мне")
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
    form.addEventListener('submit', e => {
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
      (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json) // обращаемся к json-server
      // т.к. fetch возвращает промис, то через then пропишем код, который вернётся в случае успешной отправки данных на сервер
      .then(data => {
        // data это те данные, что вернутся от сервера
        console.log(data);
        showThanksModal(message.success);
        statusMessage.remove();
      }).catch(() => {
        showThanksModal(message.failure);
      }).finally(() => {
        form.reset();
      });
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
    setTimeout(() => {
      // через какое-то время наша функция сама обновит содержимое модального окна
      thanksModal.remove(); // удаляем блок с уведомлением
      prevModalDialog.classList.remove('hide');
      (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal'); // закрываем модальное окно
    }, 4000);
  }
}
/* harmony default export */ __webpack_exports__["default"] = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeModal: function() { return /* binding */ closeModal; },
/* harmony export */   openModal: function() { return /* binding */ openModal; }
/* harmony export */ });
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

  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.getAttribute('data-close') == '') {
      // если пользователь кликнул на зону вне модального окна или на крестик, оно закроется
      closeModal(modalSelector);
    }
  });

  // пропишем код, чтобы модальное окно закрывалось, когда пользователь нажмёт на кнопку esc
  // для этого используем событие keydown, которое отслеживает нажатие клавиатуры,
  // чтобы отследить нажатие именно клавиатуры, используем такое свойство event, как code
  // так как нажатие клавиши не связано с зоной видимости элементов/страницы, её навешиваем на весь документ сразу
  // также предусмотрим проверку не только нажатия кнопки esc, но и открыто ли модальное окно, чтобы событие, привязанное к esc, срабатывало только при открытом модальном окне
  document.addEventListener('keydown', event => {
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
/* harmony default export */ __webpack_exports__["default"] = (modal);



/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function slider(_ref) {
  let {
    container,
    slide,
    nextArrow,
    prevArrow,
    totalCounter,
    currentCounter,
    wrapper,
    field
  } = _ref;
  // в аргументах функции используем деструктуризацию, а сами аргументы укажем в основном js-файле в соответствующей функции
  // создадим слайдер на сайте, вариант 1 - простой
  // Цель: реализовать функционал слайдера
  // Задачи:
  // 1. Создать все блоки слайдера
  // 2. Создать индекс для каждого слайдера
  // 3. Реализовать функцию, которая будет скрывать ненужные слайдеры и создавать нужные
  // 4. Реализовать функцию, которая будет реагировать на нажатие кнопок, влекущих смену слайда, причём в пределах количества слайдов
  // 5. Отображать общее количество слайдов и номер текущего в формате 01-9

  //создадим переменные
  // const slides = document.querySelectorAll('.offer__slide'), // это все слайды на странице
  //       prev = document.querySelector('.offer__slider-prev'), // это кнопка назад в выборе слайдов
  //       next = document.querySelector('.offer__slider-next'), // это кнопка вперёд в выборе слайдов
  //       total = document.querySelector('#total'),// это поле счётчика слайдов с общим количеством слайдов
  //       current = document.querySelector('#current'); // это поле счётчика слайдов с номером текущего слайда

  // let slideIndex = 1; // это индекс слайда, кт будет отображаться на сайте

  // // инициализируем функцию (мы её прописали ниже), чтобы при первой загрузке страницы отражался только слайд по умолчанию
  // showSlides(slideIndex);

  // // при загрузке сайта пропишем код, чтобв показывались изначальные значения счётчика слайдов
  // // мы не помещаем этот код в функцию showSlides, потому что она будет вызываться при каждом нажатии на стредки выбора слайдов и тогда определение и отображение общего количества слайдов в счётчике каждый раз будет заново срабатывать,
  // // а это лишняя нагрузка на систему, нам достаточно один раз определить общее количество слайдов, при первой загрузке странице, дальше это делать не нужно
  // if (slides.length < 10) { // если общее количество слайдов меньше 10, то показываем их количество в формате 01-9
  //     total.textContent = `0${slides.length}`; 
  // } else { // если общее количество слайдом 10 или больше, просто показываем их количество
  //     total.textContent = slides.length; 
  // };

  // // создаём функцию по отображению слайдов
  // function showSlides(n) {
  //     if (n > slides.length) { // если номер слайда больше максимального количества слайдов, то будет показываться первый слайд (прокрутка вправо)
  //         slideIndex = 1;
  //     }

  //     if (n < 1) { // если номер слайда меньше 1, то будет показываться последний слайд (прокрутка влево)
  //         slideIndex = slides.length;
  //     }

  //     slides.forEach(item => item.style.display = 'none'); // скрыли все слайды

  //     slides[slideIndex - 1].style.display = 'block'; // показываем нужный нам слайд

  //     if (slides.length < 10) { // если общее количество слайдов меньше 10, то показываем номер текущего слайда в формате 01-9
  //         current.textContent = `0${slideIndex}`; 
  //     } else { // если общее количество слайдом 10 или больше, просто показываем номер текущего слайда
  //         current.textContent = slideIndex; 
  //     };
  // }

  // // создадим функцию по смене слайдов
  // function plusSlides(n) {
  //     showSlides(slideIndex += n); // если n = 1, будет показываться следующий слайд, если n = -1, то будет показываться предыдущий слайд
  // }

  // // навешиваем обработчики событий на стрелки prev и next
  // prev.addEventListener('click', () => {
  //     plusSlides(-1);
  // });

  // next.addEventListener('click', () => {
  //     plusSlides(1);
  // });

  // создадим слайдер на сайте, вариант 2 - сложный, чтобы слайды менялись плавно, как бы прокручиваясь
  // для этого варианта в html-файле все блоки с слайдами обернули в ещё один блок с классом offer__slider-inner
  // это сделано для того, чтобы было создано как бы окно, в рамках которого будет происходить смена слайдов
  // общая логика такая: есть общая обёртка для слайдов и их вновь созданной обёртки, у этой глобальной обёртки ширина будет 100% ширины одного слайда
  // у вновь созданной обёртки слайдов ширина будет равна ширине всех слайдов, в нашем случае это 400% ширины одного слайды
  // когда пользователь будет нажимать стрелки вперёд и назад, будет происходить не скрывание всех слайдов и отображение выбранного,
  // а как бы перемещение видимой области с одного слайда на другой
  // также создадим навигацию слайдов в виде точек, нажимая на ту или иную точку, пользователю будет показываться соответствующий слайд
  const slides = document.querySelectorAll(slide),
    // это все слайды на странице
    slider = document.querySelector(container),
    // это весь объект слайдера, который включает в себя, как счётчик слайдов, так и контейнер с слайдами
    prev = document.querySelector(prevArrow),
    // это кнопка назад в выборе слайдов
    next = document.querySelector(nextArrow),
    // это кнопка вперёд в выборе слайдов
    total = document.querySelector(totalCounter),
    // это поле счётчика слайдов с общим количеством слайдов
    current = document.querySelector(currentCounter),
    // это поле счётчика слайдов с номером текущего слайда
    slidesWrapper = document.querySelector(wrapper),
    // это глобальная обёртка слайдов, куда входит обёртка слайдов и сами слайды
    slidesField = document.querySelector(field),
    // это вновь созданная обёртка слайдов, в которую входят слайды и которая входит в глобальную обёртку
    width = window.getComputedStyle(slidesWrapper).width; // получили размер ширины глобальной обёртки (она будет равна ширине слайда) через ComputedStyle

  let slideIndex = 1;
  let offset = 0; // установили размер отступа, при достижении определённого значения отступа будет срабатывать код, передвигающий в видимую зону нужный слайд

  // устанавливаем изначальный счётчик слайдов
  if (slides.length < 10) {
    total.textContent = `0${slides.length}`; // если общее количество слайдов меньше 10, то показываем их количество в формате 01-9
    current.textContent = `0${slideIndex}`; // устанавливаем начальное значение текущего слайда
  } else {
    // если общее количество слайдом 10 или больше, просто показываем их количество
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }
  ;
  slidesField.style.width = 100 * slides.length + '%'; // для обёртки слайдов устанавливаем размер ширины, равный сумме ширин всех слайдов
  slidesField.style.display = 'flex'; // для обёртки слайдов указываем, что внутри неё элементы располагаются по свойству flex (теперь они будут все в один ряд)
  slidesField.style.transition = '0.5s all'; // для обёртки слайдов указываем свойство transition, которое меняет отображение элемента

  // чтобы на сайте был видимым только один слайд, для глобальной обёртки установим свойству overflow значение hidden, чтобы оно скрывало всё то, что выходит за пределы ширины элемента
  slidesWrapper.style.overflow = 'hidden';
  slides.forEach(slide => {
    // Это делаем, чтобы установить всем слайдам одинаковую ширину (ширину глобальной обёртки)
    slide.style.width = width;
  });
  slider.style.position = 'relative'; // меняем позицию на относительную

  const indicators = document.createElement('ol'),
    // создадим наш элемент, куда потом поместим точки, это будет упорядоченный список
    dots = []; // создаём пустой массив, в него потом поместим все созданные точки-навигаторы слайдов для более удобной работы

  indicators.classList.add('carousel-indicators'); // добавляем CSS-класс
  indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `; // стилизовали наш элемент
  slider.append(indicators); // помещаем наш элемент в слайдер

  // теперь нужно наполнить наш элемент непосредственно точками
  for (let i = 0; i < slides.length; i++) {
    // перебирая слайды, создадим количество точек, равное количеству слайдов
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1); // каждой созданной точке добавляем атрибут и значение атрибута (чтобы оно соответствовало индексу слайда)
    dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `; // стилизуем наши точки
    if (i == 0) {
      // для точки первого слайда установим видимость 1, чтобы на фоне остальных точек она подсвечивалась, что отражает её активный статус
      dot.style.opacity = 1;
    }
    indicators.append(dot); // добавляем точки в созданный для них контейнер
    dots.push(dot); // добавляем точку в массив
  }

  // создадим функцию, которая будет увеличивать текущее значение индекса слайдера
  function incCurrentIndex() {
    if (slideIndex == slides.length) {
      // если индекс текущего слайда стал равен общему количеству слайдов, текущий индекс вновь приводим к изначальному значению (в нашем случае это 1)
      slideIndex = 1;
    } else {
      // в ином случае номер индекса увеличивается
      slideIndex++;
    }
  }
  ;

  // создадим функцию, которая будет уменьшать текущее значение индекса слайдера
  function decCurrentIndex() {
    if (slideIndex == 1) {
      // если индекс текущего слайда стал равен общему количеству слайдов, текущий индекс вновь приводим к изначальному значению (в нашем случае это 1)
      slideIndex = slides.length;
    } else {
      // в ином случае номер индекса увеличивается
      slideIndex--;
    }
  }
  ;

  // создадим функцию, которая будет менять текущее значение счётчика слайдера
  function showCurrentSlide() {
    if (slides.length < 10) {
      // если общее количество слайдов меньше 10, то в счётчике слайдов показываем номер индекса в формате 01-9
      current.textContent = `0${slideIndex}`;
    } else {
      // иначе в счётчике слайдов просто показываем номер индекса
      current.textContent = slideIndex;
    }
  }
  ;

  // создадим функцию, которая будет менять интенсивность видимости точки слайда
  function showCurrentDot(dots) {
    dots.forEach(dot => dot.style.opacity = '.5'); // каждой точке-навигатору ставим видимость в половинку
    dots[slideIndex - 1].style.opacity = 1; // точке того слайда, который отобразится на странице, ставим максимальную видимость
  }
  ;

  // создадим функцию, которая будет брать строку, содержащую числовые значения, приводить её к числу и убирать нечисловые символы
  function stringToNumber(str) {
    str = +str.slice(0, -2);
    return str;
  }
  ;

  // создадим обработчик событий, чтобы передвигалась видимая зона слайдов с одного слайда на другой
  // это также будет работать при нажатии стрелок вперёд и назад
  // в первой версии слайдера изменение счётчика слайдов было прописано отдельной функцией, в этой версии изменение счётчика вшито в обработчики событий
  next.addEventListener('click', () => {
    if (offset == stringToNumber(width) * (slides.length - 1)) {
      // если ползунок докрутился до предельного значения, он возвращается в первоначальное значение
      // используем метод replace, чтобы заменять нечисловые символы пустотой, для этого прописываем регулярное выражение /\D/ (означает нечисловые символы) и флаг g (глобальный поиск)
      offset = 0;
    } else {
      // если ползунок не докрутился до предельного значения, прибавляем размер одного слайда, тем самым, зона видимости будет смещаться, показывая новый слайд
      offset += stringToNumber(width); // пишем так, потому что width это, например, 650px, а нам в математике нужно убрать лишние буквы, делаем это через slice (можно через регулярные выражения)
    }

    slidesField.style.transform = `translateX(-${offset}px)`; // прописываем код, который будет смещать обёртку влево при нажатии кнопки назад или вперёд

    incCurrentIndex();
    showCurrentSlide();
    showCurrentDot(dots);
  });
  prev.addEventListener('click', () => {
    if (offset == 0) {
      // если ползунок докрутился до начального значения, он переходит в максимальное значение (к последнему слайду)
      offset = stringToNumber(width) * (slides.length - 1);
    } else {
      // если ползунок не докрутился до начального значения, минусуем размер одного слайда, тем самым, зона видимости будет смещаться, показывая новый слайд
      offset -= stringToNumber(width); // пишем так, потому что width это, например, 650px, а нам в математике нужно убрать лишние буквы, делаем это через slice (можно через регулярные выражения)
    }

    slidesField.style.transform = `translateX(-${offset}px)`; // прописываем код, который будет смещать обёртку вправо при нажатии кнопки назад или вперёд

    decCurrentIndex();
    showCurrentSlide();
    showCurrentDot(dots);
  });

  // пропишем код, чтобы когда пользователь нажимал на ту или иную точку, ему показывался соответствующий слайд
  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      const slideTo = e.target.getAttribute('data-slide-to'); // получаем порядковый номер точки, на которую нажал пользователь

      slideIndex = slideTo; // так как все слайды пронумерованы через атрибут data-slide-to, а на slideIndex завязан функционал отображения слайдов и счётчика слайдов,
      // то slideIndex присваиваем значение того слайда, который был выбран пользователем
      offset = stringToNumber(width) * (slideTo - 1); // меняем значение offset (на нём завязано отображение нужного слайда)

      slidesField.style.transform = `translateX(-${offset}px)`; // это меняет отображение слайдов, поэтому данный код также предусматриваем (как и при нажатии на кнопки вперёд и назад)

      showCurrentSlide();
      showCurrentDot(dots);
    });
  });
}
/* harmony default export */ __webpack_exports__["default"] = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
  // Задачи по этому проекту:
  // Цель: создать функционал, чтобы при выборе стилей питания менялась картинка и описание
  // 1. Сделать так, чтобы другие блоки с информацией были неактивны
  // 2. Сделать так, чтобы показать нужный блок
  // 3. Создать обработчик события для задач выше
  const tabs = document.querySelectorAll(tabsSelector),
    // создали переменную со всеми кнопками выбора вида питания
    tabsContent = document.querySelectorAll(tabsContentSelector),
    // создали переменную со всеми контейнерами информации по видам питания
    tabsParent = document.querySelector(tabsParentSelector); // создали переменную с родительским элементом для кнопок выбора вида питания

  // для выбора активного варианта вида питания будем использовать
  // уже предусмотреннй класс tabheader__item_active, который присваивается нажатой кнопке выбора вида питания
  // создаём функцию, которая будет скрывать контейнеры информации
  function hideTabContent() {
    tabsContent.forEach(item => {
      item.style.display = 'none';
    }); // скрываем все контейнеры информации

    tabs.forEach(item => {
      item.classList.remove(activeClass);
    }); // у каждого контейнера убираем класс активности
  }
  ;

  // создаём функцию, которая будет показывать нужный контейнер информации
  function showTabContent() {
    let i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    // в стандарте ES6 появилась возможность ставить значения по умолчанию, сейчас это первый элемент
    tabsContent[i].style.display = 'block'; // выбранный контейнер (при помощи аргумента i) показываем
    tabs[i].classList.add(activeClass); // добавляем выбранной кнопке вида питания класс активности
  }
  ;
  hideTabContent(); // скрыли все контейнеры информации
  showTabContent(); // показали выбранный контейнер информации (по умолчанию, это первый вариант)

  // создаём обработчик события, чтобы при клике на один из вариантов вида питания отображался нужный элемент
  // при этом используем делегирование (обращаемся к родительскому элементу и навешиваем код на нужные дочерние элементы)
  tabsParent.addEventListener('click', event => {
    const target = event.target; // сделать переменную, чтобы потом писать меньше кода

    if (target && target.classList.contains(tabsSelector.slice(1))) {
      // используем slice, потому что тут надо указать класс без точки
      // чтобы код сработал, нам надо узнать номер той кнопки, на которую кликнул пользователь
      // это можно сделать через перебор
      tabs.forEach((item, i) => {
        if (target == item) {
          // если элемент, на который кликнули, будет совпадать с элементом, который мы перебираем, то сработает основной код
          hideTabContent(); // всё скрыли
          showTabContent(i); // показываем тот элемент, на который кликнули
        }
        ;
      });
    }
    ;
  });
}
/* harmony default export */ __webpack_exports__["default"] = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function timer(id, deadline) {
  // Цель: создать таймер отсчёта обратного времени на сайте
  // Задачи:
  // 1. Создать функцию, которая будет запускать таймер
  // 2. Создать функцию, которая будет определять разницу во времени
  // 3. Создать функцию, которая будет обновлять данные оставшегося времени

  // итоговую дату, до которой будет идти таймер, в формате строки, введём как аргумент функции в основном js-файле

  // создаём функцию, которая будет определять разницу между текущим временем пользователя
  // и временем дедлайна
  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    let t = Date.parse(endtime) - Date.parse(new Date()); // из строки со временем создаём время и отнимаем текущее время

    if (t <= 0) {
      // Добавляем проверку того, чтобы таймер не показывал отрицательное значение (если в deadline вдруг попадёт прошедшая дата)
      days = 0; // всем значениям просто присваиваем нулевое значение
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      // из полученной разницы вычисляем количество оставшихся дней
      hours = Math.floor(t / (1000 * 60 * 60) % 24),
      // из поулченной разницы вычисляем количество часов, процент на остаток используется, чтобы вычислить часы в формате 24-часового времени
      minutes = Math.floor(t / (1000 * 60) % 60),
      // из поулченной разницы вычисляем количество минут, процент на остаток используется, чтобы вычислить минуты в формате 60-минутного часа
      seconds = Math.floor(t / 1000 % 60); // из поулченной разницы вычисляем количество секунд, процент на остаток используется, чтобы вычислить секунды в формате 60-секундной минуты
    }

    return {
      // чтобы использовать переменные, которые мы создали внутри функции, за её пределами, мы будет возвращать объект с этими переменными в качестве значений свойств объекта
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
    // это изначальный блок кода, который был до дополнительного урока, он работающий, но при таком коде, если в дедлайне будет прошедшая дата,
    // то на сайте в таймере будут отражены отрицательные значения, что некрасиво, поэтому лучше сразу предусмотреть проверку значения переменно t,
    // если оно отрицательно, то просто будут выведены нули, если положительно, то сработает полный код
    // let t = Date.parse(endtime) - Date.parse(new Date()), // из строки со временем создаём время и отнимаем текущее время
    //       days = Math.floor(t / (1000 * 60 * 60 * 24)), // из полученной разницы вычисляем количество оставшихся дней
    //       hours = Math.floor((t / (1000 * 60 * 60)) % 24), // из поулченной разницы вычисляем количество часов, процент на остаток используется, чтобы вычислить часы в формате 24-часового времени
    //       minutes = Math.floor((t / (1000 * 60)) % 60),// из поулченной разницы вычисляем количество минут, процент на остаток используется, чтобы вычислить минуты в формате 60-минутного часа
    //       seconds = Math.floor((t / 1000) % 60);// из поулченной разницы вычисляем количество секунд, процент на остаток используется, чтобы вычислить секунды в формате 60-секундной минуты
    // return { // чтобы использовать переменные, которые мы создали внутри функции, за её пределами, мы будет возвращать объект с этими переменными в качестве значений свойств объекта
    //     'total': t,
    //     'days': days,
    //     'hours': hours,
    //     'minutes': minutes,
    //     'seconds': seconds
    // };
  }
  ;

  // это действие создаётся после написания всего кода, чтобы оптимизировать его для пользователя
  // updateClock возвращает данные в том виде, каком получил (например, 9 часов), а иногда могут попросить отображать это в виде 09 часов
  // для этого здесь придумаем функцию, которая будет проверять формат полученного значения и, если что, переводить его в формат "00"
  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
    ;
  }
  ;

  // создаём функцию, которая будет устанавливать значения для таймера с сайта
  function setClock(selector, endtime) {
    // selector - это элемент на странице, куда будут передаваться данные; endtime - время, которое будет передаваться на сайт
    const timer = document.querySelector(selector),
      // создаём переменную с общим элементом таймера
      days = timer.querySelector('#days'),
      // создаём отдельные части таймера с уже введёнными id соответствующих блоков
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000); // на сайте таймер должен обновляться ежесекундно, поэтому используем setInterval

    // это действие создаётся после написания всего кода, чтобы оптимизировать его для пользователя
    // сперва на сайте задаётся изначальное значение, кт прописано в HTML, потом проходит секунда (установленная в setInterval) и начинает работать функция updateClock
    // это некрасиво, поэтому здесь пропишется первая инициализация функции updateClock, чтобы она сработала при формировании страницы, а затем начнёт работат setInterval
    updateClock();
    // создаём функцию, которая будет обновлять таймер со страницы
    function updateClock() {
      const t = getTimeRemaining(endtime); // вычисляем разницу во времени при помощи вышенаписанной функции, кт вернёт объект с разными данными, кт ниже пойдут в соответствующие части таймера

      days.innerHTML = getZero(t.days); // изначально было просто t.days, пока мы не придумали функцию getZero
      hours.innerHTML = getZero(t.hours); // изначально было просто t.hours, пока мы не придумали функцию getZero
      minutes.innerHTML = getZero(t.minutes); // изначально было просто t.minutes, пока мы не придумали функцию getZero
      seconds.innerHTML = getZero(t.seconds); // изначально было просто t.seconds, пока мы не придумали функцию getZero
      // теперь надо предусмотреть ограничитель, чтобы функция (и таймер) не работали бесконечно
      // для этого мы ранее предусматривали дедлайн
      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
      ;
    }
    ;
  }
  ;
  setClock(id, deadline);
}
/* harmony default export */ __webpack_exports__["default"] = (timer);

/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getResource: function() { return /* binding */ getResource; },
/* harmony export */   postData: function() { return /* binding */ postData; }
/* harmony export */ });
const postData = async (url, data) => {
  // т.к. fetch это асинхронный код, то в данной функции сперва будет создаваться запрос, потом он будет присваиваться переменной, затем будет вызвана функция преобразования json() и, наконец, будет возвращён результат
  // поэтому может быть ситуация, когда запрос ещё не обработался (не вернулся ответ от сервера), а дальнейший код уже выполняется, а раз ничего не вернулось, то это значит, что пока имеется значение underfined
  // из-за этого может сработать ошибка (у underfined нет методов, например), и весь дальнейший код не сработает, поэтому нужно искусственно как бы превратить асинхронный код в подобние синхронного
  // поэтому, во-первых, при создании функции мы указываем атрибут async (он показывает, что код внутри функции будет асинхронным), во-вторых, оператор await (который говорит, действие какого кода должна ждать следующая операция)
  // атрибуты async и await парные! их нельзя использовать по одиночке!
  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: data
  });
  return await res.json();
};
async function getResource(url) {
  let res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }
  return await res.json();
}
;



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
// все отдельные функции сайта распределены по модулям (в соответствующих JS-файлах), сейчас их нужно импортировать в этот JS-файл, который является главным
 // мы не пишем в конце пути js, потому что Webpack сам знает, что это путь к js-файлу







window.addEventListener('DOMContentLoaded', () => {
  const modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__.openModal)('.modal', modalTimerId), 50000);
  // мы импортировали функции, теперь их нужно вызвать, чтобы они заработали
  (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_0__["default"])('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
  (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__["default"])('[data-modal]', '.modal', modalTimerId);
  (0,_modules_timer__WEBPACK_IMPORTED_MODULE_2__["default"])('.timer', '2023-10-27');
  (0,_modules_calc__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_modules_forms__WEBPACK_IMPORTED_MODULE_4__["default"])('form');
  (0,_modules_slider__WEBPACK_IMPORTED_MODULE_5__["default"])({
    // аргументы-свойства можно прописать в любом порядке, потому что при создании функции мы использовали деструктуризацию
    container: '.offer__slider',
    slide: '.offer__slide',
    nextArrow: '.offer__slider-next',
    prevArrow: '.offer__slider-prev',
    totalCounter: '#total',
    currentCounter: '#current',
    wrapper: '.offer__slider-wrapper',
    field: '.offer__slider-inner'
  });
  (0,_modules_cards__WEBPACK_IMPORTED_MODULE_6__["default"])();
});
}();
/******/ })()
;
//# sourceMappingURL=bundle.js.map