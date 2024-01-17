import {getResource} from "../services/services";

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
        constructor(img, altimg, title, descr, price, parentSelector, ...classes) { 
            this.img = img;
            this.altimg = altimg;
            this.title = title;
            this.descr = descr;
            this.price = price;
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
    getResource('http://localhost:3000/menu') // обращаемся к серверу за данными
        .then(data => { // полученные от сервера данные в виде массива перебираем, превращая каждый элемент в карточку меню
            data.forEach(({img, altimg, title, descr, price}) => { // используем деструктуризацию, чтобы меньше писать в аргументах new MenuCard
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

export default cards;