    // используем синтаксис ESM
    import tabs from './modules/tabs';
    import modal from './modules/modal';
    import timer from './modules/timer';
    import cards from './modules/cards';
    import calc from './modules/calc';
    import slider from './modules/slider';
    import forms from './modules/forms';
    import { openModal } from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 300000); //открывается модальное окно через 30 секунд перебывания пользователя на сайте 
    
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2023-12-11');
    cards();
    calc();
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    }); //используем деструктуризацию
    forms('form', modalTimerId);

});