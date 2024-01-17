// все отдельные функции сайта распределены по модулям (в соответствующих JS-файлах), сейчас их нужно импортировать в этот JS-файл, который является главным
import tabs from './modules/tabs'; // мы не пишем в конце пути js, потому что Webpack сам знает, что это путь к js-файлу
import modal from './modules/modal';
import timer from './modules/timer';
import calc from './modules/calc';
import forms from './modules/forms';
import slider from './modules/slider';
import cards from './modules/cards';
import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);
    // мы импортировали функции, теперь их нужно вызвать, чтобы они заработали
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2023-10-27');
    calc();
    forms('form');
    slider({ // аргументы-свойства можно прописать в любом порядке, потому что при создании функции мы использовали деструктуризацию
        container: '.offer__slider', 
        slide: '.offer__slide', 
        nextArrow: '.offer__slider-next', 
        prevArrow: '.offer__slider-prev', 
        totalCounter: '#total', 
        currentCounter: '#current', 
        wrapper: '.offer__slider-wrapper', 
        field: '.offer__slider-inner'
    });
    cards();


});




