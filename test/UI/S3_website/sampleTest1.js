// test/UI/S3_website/sampleTest1.js
const fs = require('fs');
const path = require('path');
const bypassInterstitial = require('../../utils/bypassInterstitial');

module.exports = {
  '@tags': ['smoke'],

  'Home → Contact → Back to Home': async (browser) => {
    const BASE_URL = 'http://s3-design-sample-site.s3-website-us-west-2.amazonaws.com/';

    // Contact trigger: href/img/text variants
    const CONTACT_ANY = {
      selector:
        "//*[self::a or self::button or self::area][contains(translate(@href,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'contact')]" +
        " | //a[.//img[contains(translate(@src,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'contact')]]" +
        " | //*[self::a or self::button][contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'contact')]",
      locateStrategy: 'xpath'
    };

    // More robust header match (p/h1/h2, case-insensitive)
    const CONTACT_HEADER = {
      selector:
        "//*[self::p or self::h1 or self::h2]" +
        "[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')," +
        " 'contact acme chemicals')]",
      locateStrategy: 'xpath'
    };

    // Ensure we’re not stuck on chrome-error or a blank data: page
    async function ensureLoaded(url) {
      await browser.url(({ value }) => {
        const bad = !value || value.startsWith('data:') || /chrome-error|chromewebdata/i.test(value);
        if (bad) {
          // force reload of real page once
          browser.url(url).pause(500);
        }
      });

      // If body has almost no text, dump HTML for debugging and retry once
      await browser.execute(function () {
        return (document.body && (document.body.innerText || '').trim().length) || 0;
      }, [], ({ value: len }) => {
        if (!len || len < 10) {
          browser.execute(function () {
            return document.documentElement ? document.documentElement.outerHTML : '';
          }, [], ({ value: html }) => {
            try {
              const dir = path.join(process.cwd(), 'tests_output', 'ui', 'debug');
              fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(path.join(dir, 's3_home_dom.html'), html || '');
            } catch (_) {}
          });
          browser.refresh().pause(500);
        }
      });
    }

    // 1) Open, bypass if needed, verify loaded, screenshot
    await browser.url(BASE_URL).waitForElementPresent('body', 10000);
    await bypassInterstitial(browser);
    await ensureLoaded(BASE_URL);
    await browser.saveScreenshot('tests_output/ui/s3_home.png');

    // 2) Go to contact (click if found; otherwise navigate directly)
    await browser
      .perform((done) => {
        browser.execute(function (x) {
          try {
            return !!document.evaluate(x, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
          } catch (e) { return false; }
        }, [CONTACT_ANY.selector], ({ value }) => {
          if (value) {
            browser.click(CONTACT_ANY);
          } else {
            browser.url(BASE_URL + 'contact.html');
          }
          done();
        });
      })
      .waitForElementVisible('body', 10000)
      .assert.urlContains('contact.html', 'URL includes contact.html');

    // 3) Verify header, screenshot
    await ensureLoaded(BASE_URL + 'contact.html');
    await browser
      .waitForElementVisible(CONTACT_HEADER, 10000, 'Contact header visible')
      .assert.containsText(CONTACT_HEADER, 'CONTACT ACME CHEMICALS')
      .saveScreenshot('tests_output/ui/s3_contact.png');

    // 4) Back to Home
    await browser
      .back()
      .waitForElementVisible('body', 10000)
      .assert.not.urlContains('contact.html', 'No longer on contact page')
      .saveScreenshot('tests_output/ui/s3_home_back.png');

    await browser.end();
  }
};
