const { expect } = require('@playwright/test');

exports.MenuAbout = class MenuAbout {
/**
   * @param {import('@playwright/test').Page} page
   */
    //название ссылок
    static namelinks ={
        about:'Компания «ИнфоТеКС»',
        sites:'Экосистема ИнфоТеКС',
        license:'Лицензии',
        academy:'Академия',
        patents:'Патенты',
        awards:'Награды',
        requisites:'Реквизиты',
        vacancies:'Вакансии',
        contacts:'Контакты'
    } 
    
    constructor(page){
        this.page = page;
        
        this.menuButton = page.locator('[data-b-header__menu-hamburger-bemid]'); //Menu
        this.aboutCompanyButton = page.locator('div.b-header__mobile-menu-item[data-link="/about/"]');//О компании High
        this.mobileMenuButton = page.locator('div.b-header__mobile-menu-section[data-b-header__mobile-menu-section-bemid]', {hasText: "О компании"});

        this.filterPatentOne = page.locator('div.b-files-page__category[data-b-files-page__category-bemid]').first(); //Кнопка фильтра "Патенты РФ на изобретения"
        this.filterPatentAll = page.locator('div.b-files-page__category.all[data-b-files-page__category-bemid]');//Кнопка фильтра "Выбрать все"
        this.filterOneValue = 'b-files-page__category b-files-page__category--js_init active';//active 'Кнопка фильтра "Патенты РФ на изобретения'
        this.filterOneCount = '.b-files-page__category-count'; //count "Патенты РФ на изобретения"
        this.countAll = page.locator('div.b-files-page__title-count');//count"Патенты" 

        this.search = page.locator('.b-header__menu-icon.b-header__menu-icon--loupe'); //Кнопка поиска
        this.inputText = page.locator('.b-header__search-field');// поле ввода поиска

    }
    //проверка видимости и нажатие на элемент
    async clickNavigateButton(button){ 
        await expect(button).toBeVisible();
        await button.click();
    }
    //проверка видимости используя другой метод, после нажимаем на элемент(ссылку)
    async clickTab(tabkey){
        await this.checkVisibleLinks(tabkey);
        await this.page.locator('a.b-header__mobile-menu-link', {hasText: tabkey}).click();
    }
    //проверка видимости элемента(ссылки)
    async checkVisibleLinks(name) {
        await expect(this.page.locator('a.b-header__mobile-menu-link', {hasText: name})).toBeVisible();
    }

}																				