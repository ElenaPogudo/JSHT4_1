var webdriver = require("selenium-webdriver");

//var assert = require('chai.assert');

function createDriver() {
    var driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.chrome()).build();
    driver.manage().window().maximize();
    driver.manage().timeouts().implicitlyWait(20000);
    return driver;
}

var browser = createDriver();

function clickLink(link) {
    link.click();
}

function handleFailure(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    closeBrowser();
}

function signIn(login, password) {
    return browser.findElement(webdriver.By.css('a.btn.head-btn')).click().then(()=>{
    return browser.findElement(webdriver.By.name('login')).sendKeys(login)}).then(() => {
        return browser.findElement(webdriver.By.name('password')).sendKeys(password);
    }).then(() => {
        return browser.findElement(webdriver.By.css('div.loginbox-login > button.btn')).click();
    })
}

function closeBrowser() {
    browser.quit();
}

function logTitle() {
    browser.getTitle().then(function (title) {
        console.log('Current Page Title: ' + title);
    });
}

function logResult(result) {
    console.log('Consequences: ' + result.length);
}


browser.get('http://www.seasonvar.ru/').then(() => {
    signIn('elena@pogudo.org','Gfhjkm7244');
}).then(()=>{
    return browser.findElement(webdriver.By.name("q"));
}).then((el) => {
    browser.sleep(200);
    el.clear();
    return el.sendKeys('Star');
}).then(()=>{
    browser.sleep(200);
    return browser.findElement(webdriver.By.css("button.btn.head-btn")).click();
}).then(() => {
    browser.sleep(200);
    var result = browser.findElements(webdriver.By.xpath("//a[contains(text(),'Звездные врата')]"));
    return result;
}).then((result) => {
    browser.sleep(200);
    return logResult(result) + logTitle();
}).then(() => {
    browser.navigate().back();
    return logTitle();
    //console.log(assert.equal('Сериалы ТУТ! Сериалы онлайн смотреть бесплатно. Смотреть онлайн','Сериалы ТУТ! Сериалы онлайн смотреть бесплатно. Смотреть онлайн'));
}).then(() => {
    closeBrowser();
});