function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    // Задачи по этому проекту:
    // Цель: создать функционал, чтобы при выборе стилей питания менялась картинка и описание
    // 1. Сделать так, чтобы другие блоки с информацией были неактивны
    // 2. Сделать так, чтобы показать нужный блок
    // 3. Создать обработчик события для задач выше
    const tabs = document.querySelectorAll(tabsSelector), // создали переменную со всеми кнопками выбора вида питания
          tabsContent = document.querySelectorAll(tabsContentSelector), // создали переменную со всеми контейнерами информации по видам питания
          tabsParent = document.querySelector(tabsParentSelector); // создали переменную с родительским элементом для кнопок выбора вида питания
    
    // для выбора активного варианта вида питания будем использовать
    // уже предусмотреннй класс tabheader__item_active, который присваивается нажатой кнопке выбора вида питания
    // создаём функцию, которая будет скрывать контейнеры информации
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        }); // скрываем все контейнеры информации
        
        tabs.forEach(item => {
            item.classList.remove(activeClass)
        }); // у каждого контейнера убираем класс активности
    };

    // создаём функцию, которая будет показывать нужный контейнер информации
    function showTabContent(i = 0) { // в стандарте ES6 появилась возможность ставить значения по умолчанию, сейчас это первый элемент
        tabsContent[i].style.display = 'block'; // выбранный контейнер (при помощи аргумента i) показываем
        tabs[i].classList.add(activeClass); // добавляем выбранной кнопке вида питания класс активности
    };

    hideTabContent(); // скрыли все контейнеры информации
    showTabContent(); // показали выбранный контейнер информации (по умолчанию, это первый вариант)

    // создаём обработчик события, чтобы при клике на один из вариантов вида питания отображался нужный элемент
    // при этом используем делегирование (обращаемся к родительскому элементу и навешиваем код на нужные дочерние элементы)
    tabsParent.addEventListener('click', (event) => {
        const target = event.target; // сделать переменную, чтобы потом писать меньше кода
        
        if (target && target.classList.contains(tabsSelector.slice(1))) { // используем slice, потому что тут надо указать класс без точки
            // чтобы код сработал, нам надо узнать номер той кнопки, на которую кликнул пользователь
            // это можно сделать через перебор
            tabs.forEach((item, i) => {
                if (target == item) { // если элемент, на который кликнули, будет совпадать с элементом, который мы перебираем, то сработает основной код
                    hideTabContent(); // всё скрыли
                    showTabContent(i); // показываем тот элемент, на который кликнули
                };
            });
        };
    });
}

export default tabs;