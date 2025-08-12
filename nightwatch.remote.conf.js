// Minimal override so Nightwatch uses a remote WebDriver (Selenium) instead of starting Chromedriver.
const base = require('./nightwatch.conf.js'); // use your existing config
module.exports = {
  ...base,
  test_workers: false, // run serially to avoid multi-session issues in a single Selenium node
  test_settings: {
    ...base.test_settings,
    chrome: {
      ...(base.test_settings?.chrome || {}),
      webdriver: {
        // IMPORTANT: do not start a local driver
        start_process: false,
        // Point to the Selenium container (localhost:4444 when you run `docker run selenium/standalone-chrome`)
        host: process.env.WEBDRIVER_HOST || 'localhost',
        port: Number(process.env.WEBDRIVER_PORT || 4444),
        keep_alive: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          // You can add headless here if you want it defaulted:
          // args: ['--headless=new']
          args: []
        },
        acceptInsecureCerts: true
      }
    }
  }
};
