require('dotenv').config()
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setCacheEnabled(false)
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
  await page.setDefaultNavigationTimeout(0);

  // LOGIN
  const login = {
    credentials: {
      username: process.env.BAC_USERNAME,
      password: process.env.BAC_PASSWORD
    },
    selectors: {
      inputs: {
        username: 'input[name=userName]',
        password: 'input[name=password]'
      },
      buttons: {
        login: '#okbutton'
      }
    }
  }

  await page.goto('https://www.sucursalmovil.com/secm/goLogin.go');
  await page.waitForSelector(login.selectors.inputs.username);
  await page.waitForSelector(login.selectors.inputs.password);
  await page.waitForSelector(login.selectors.buttons.login);
  await page.type(login.selectors.inputs.username, login.credentials.username);
  await page.type(login.selectors.inputs.password, login.credentials.password);
  await page.click(login.selectors.buttons.login);

  // MAIN PAGE
  const main = {
    selectors: {
      table: {
        account: 'table.listTbl > tbody > tr:nth-child(3) > td:nth-child(1)',
        amount: 'table.listTbl > tbody > tr:nth-child(3) > td:nth-child(3)'
      }
    }
  }

  await page.waitForSelector(main.selectors.table.account);
  await page.waitForSelector(main.selectors.table.amount);

  const selectorAccount = main.selectors.table.account;
  const selectorAmount = main.selectors.table.amount

  const account = await page.evaluate(selectorAccount => {
    return [...document.querySelectorAll(selectorAccount)].map(element => {
      const title = element.textContent.replace(/\s+/g, ' ').trim();
      return title;
    });
  }, selectorAccount);

  const amount = await page.evaluate(selectorAmount => {
    return [...document.querySelectorAll(selectorAmount)].map(element => {
      const title = element.textContent.replace(/\s+/g, ' ').trim()
      return title;
    });
  }, selectorAmount);

  console.log(account);
  console.log(amount);

  // LOGOUT
  const logout = {
    selectors: {
      buttons: {
        logout: '.headerRight > a:nth-child(1)'
      }
    }
  }

  await page.waitForSelector(logout.selectors.buttons.logout);
  await page.click(logout.selectors.buttons.logout);

  await browser.close();
})();