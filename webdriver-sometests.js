const webdriver = require("selenium-webdriver");
const until = webdriver.until;

// yes my own login and password and i dont like it too but had no better idea
const login = "elena@pogudo.org";
const password = 'Gfhjkm7244';
const searchText = "Star";

function createDriver() {
    const driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.chrome()).build();
    driver.manage().window().maximize();
    driver.manage().timeouts().implicitlyWait(20000);
    return driver;
}

const browser = createDriver();

function handleFailure(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    closeBrowser();
}

function logIn(login, password) {
    return browser.findElement(webdriver.By.xpath('/html/body/div[@class=\'wrapper\']/header[@class=\'header\']/div[@class=\'header_line\']/div[@class=\'headblock headblock-menu\']/a[@class=\'btn head-btn\'][1]')).click().then(() => {
        return browser.findElement(webdriver.By.name('login')).sendKeys(login)
    }).then(() => {
        return browser.findElement(webdriver.By.name('password')).sendKeys(password);
    }).then(() => {
        return browser.findElement(webdriver.By.css('div.loginbox-login > button.btn')).click();
    })
}

function searchByName(searchQuery) {
    return browser.findElement(webdriver.By.name("q")).then((el) => {
        el.clear();
        return el.sendKeys(searchQuery);
    }).then(() => {
        return browser.findElement(webdriver.By.xpath("/html/body/div[@class='wrapper']/header[@class='header']/div[@class='header_line']/form[@id='hsearch']/button[@class='btn head-btn']")).click();
    }).then(() => {
        return browser.wait(until.elementLocated(webdriver.By.css("div.pgs-search-title")), 2000).then((el) => {
            logSearchQuery(el);
        });
    })
}

function closeBrowser() {
    browser.quit();
}

function previousPage() {
    browser.navigate().back();

}

function logTitle() {
    browser.getTitle().then(function (title) {
        console.log('Current Page Title: ' + title);
    });
}

function logSearchQuery(element) {
    element.getText().then(function (text) {
        console.log(text);
    });
}

browser.get('http://www.seasonvar.ru/').then(() => {
    logIn(login, password);
}).then(() => {
    searchByName(searchText);
}).then(() => {
    previousPage();
}).then(() => {
    browser.findElement(webdriver.By.linkText("смотреть сериалы")).click();
}).then(() => {
    browser.findElement(webdriver.By.className("header_icon-vkontakte")).click();
    return logTitle();
}).then(() => {
    previousPage();
}).then(() => {
    closeBrowser();
}).catch((err) => {
    handleFailure(err);
});