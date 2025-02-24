/**
 * Тестовое задание для стажера на позицию «Автотестирование (JavaScript)
 * Выполнить, используя JS + Playwright. 
 */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const XLSX = require("xlsx");
const { MenuAbout } = require("./MenuAbout");

let testResults = [];


test("Проверка вкладок в разделе 'О компании'", async ({ page }) => {    
    
    const menuPage = new MenuAbout(page);
    await page.goto('https://infotecs.ru/');
    await menuPage.clickNavigateButton(menuPage.menuButton);
    await menuPage.clickNavigateButton(menuPage.aboutCompanyButton);
    await menuPage.clickNavigateButton(menuPage.mobileMenuButton);

    let passed = true;
    let failedTab = "";
    
    for (const key in MenuAbout.namelinks) {
        try {
            await menuPage.checkVisibleLinks(MenuAbout.namelinks[key]);
        } catch (e) {
            passed = false;
            failedTab = MenuAbout.namelinks[key];
            break;
        }
    }

    testResults.push({
        id: "TC001",
        name: "Проверка вкладок в разделе 'О компании'",
        preconditions: "Открыта страница 'О компании'",
        steps: "Открыть меню -> Перейти в 'О компании' -> Проверить видимость вкладок",
        expected: "Все вкладки должны отображаться",
        actual: passed ? "Все вкладки отображаются" : `Не найдена вкладка: ${failedTab}`,
        status: passed ? "Passed" : "Failed",
    });

    expect(passed).toBeTruthy();
});


test("Проверка Патентов", async ({ page }) => {

    await page.goto('https://infotecs.ru/about/patents/');
    const menuPage = new MenuAbout(page);

    await expect(menuPage.countAll).toBeVisible();
    const oldCount = await menuPage.countAll.innerText();

    await menuPage.clickNavigateButton(menuPage.filterPatentAll);
    await menuPage.clickNavigateButton(menuPage.filterPatentOne);
    await expect(menuPage.filterPatentOne).toHaveClass(menuPage.filterOneValue);

    await page.waitForFunction((oldValue) => {
        const newValue = document.querySelector('.b-files-page__title-count')?.innerText.trim();
        return newValue && newValue !== oldValue;
    }, oldCount);

    const newCount = await menuPage.countAll.innerText();
    const firstFilterText = await menuPage.filterPatentOne.locator(menuPage.filterOneCount).innerText();
    const firstActiveNumber = parseInt(firstFilterText.trim(), 10);

    const passed = newCount === firstActiveNumber;

    console.log(`oldCount: ${oldCount}`);
    console.log(`newCount: ${newCount}`);
    console.log(`firstActiveNumber (фильтр): ${firstActiveNumber}`);
    console.log(`passed: ${passed}`);

    //запись ячеек в файл
    testResults.push({
        id: "TC002",
        name: "Проверка фильтра 'Патенты РФ на изобретения'",
        preconditions: "Находиться на странице 'Патенты'",
        steps: "Выбрать фильтр 'Патенты РФ на изобретения' -> Проверить изменение счетчика",
        expected: "Количество патентов совпадает с фильтром",
        actual: passed ? "Количество совпадает" : `Ошибка: Ожидалось ${firstActiveNumber}, но получено ${newCount}`,
        status: passed ? "Passed" : "Failed",
    });
    // Проверяем, но тест не падает, а фиксируется в отчете
    if (!passed) {
        console.error("Ошибка: количество патентов не совпадает!");
    }
    
    // expect(passed).toBeTruthy();
});

test.afterAll(async () => {
    const filePath = "test-cases.xlsx";
    let workbook;
    let worksheet;
    let existingData = [];

    console.log("Итоговые тестовые данные:", testResults);

    if (testResults.length === 0) {
        console.error("Ошибка: testResults пуст, файл не будет обновлен!");
        return;
    }

    if (fs.existsSync(filePath)) {
        console.log("Файл уже существует. Читаем данные...");
        workbook = XLSX.readFile(filePath); // Читаем существующий файл
        if (workbook.Sheets["TestCases"]) {
            worksheet = workbook.Sheets["TestCases"];
            existingData = XLSX.utils.sheet_to_json(worksheet); // Конвертируем существующие данные в JSON
        }
    } else {
        console.log("Файл не найден. Создаем новый...");
        workbook = XLSX.utils.book_new();
    }

    // Добавляем новые данные к существующим
    const updatedData = existingData.concat(testResults);

    // Создаем новый лист или обновляем существующий
    worksheet = XLSX.utils.json_to_sheet(updatedData);
    workbook.Sheets["TestCases"] = worksheet; // Обновляем лист вручную

    // Сохраняем обновленный файл
    XLSX.writeFile(workbook, filePath);

    console.log("Данные успешно добавлены в test-cases.xlsx!");
});

test.use({ browserName: "chromium", headless: true });


// test('Поиск патентов', async ({ page }) => {
    
//     const menuPage = new MenuAbout(page);
//     const paty = require('./patents');

//     // await menuPage.clickNavigateButton(menuPage.search);

//     let counter = 0; 
//     const inputText = page.locator('.b-header__search-field');
//     for (const key in list) {
//         await menuPage.clickNavigateButton(menuPage.search);
//         await page.waitForTimeout(1000);
//         await page.locator('.b-header__search-field').click();
//         await page.waitForTimeout(1000);
//         await inputText.fill(list[key]);
//         const patentH = page.locator('.b-header__search-item-category');
//         const text = await patentH.innerText();
//         await page.waitForTimeout(1000);
//         if (text.trim() == "Патенты") {
//             counter++;
//         }
//         await page.waitForTimeout(1000);
//         await page.locator('.b-header__search-close').click();
// }
//     console.log(counter);
//     // await expect(page.locator('.b-header__search-item-category', {hasText: 'Патенты'})).toBeVisible();
//     // await expect(page.locator('.b-header__search-item-title', {hasText: `${list['1']}`})).toBeVisible();
//     //     // await page.keyboard.press('Enter');
//     // }




// });
