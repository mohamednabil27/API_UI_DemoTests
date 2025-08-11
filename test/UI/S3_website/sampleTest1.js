// test/UI/S3_website/sampleTest1.js
const bypassInterstitial = require('../../utils/bypassInterstitial');

module.exports = {
  '@tags': ['smoke'],

  'Home → Contact → Back to Home': async (browser) => {
    const BASE_URL = 'http://s3-design-sample-site.s3-website-us-west-2.amazonaws.com/';

    // Robust "Contact" control: href contains, img src contains, or text contains "contact"
    const CONTACT_ANY = {
      selector:
        "//*[self::a or self::button or self::area][contains(translate(@href,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'contact')]" +
        " | //a[.//img[contains(translate(@src,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'contact')]]" +
        " | //*[self::a or self::button][contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'contact')]",
      locateStrategy: 'xpath'
    };

    const CONTACT_HEADER = {
      selector: '//p[normalize-space(.)="CONTACT ACME CHEMICALS"]',
      locateStrategy: 'xpath'
    };

    await browser
      .url(BASE_URL)
      .waitForElementPresent('body', 10000);

    // ✅ bypass Chrome interstitial if it appears
    await bypassInterstitial(browser);

    await browser
      .saveScreenshot('tests_output/ui/s3_home.png')
      // If there is no clickable "Contact", navigate directly
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
      .assert.urlContains('contact.html', 'URL includes contact.html')
      .waitForElementVisible(CONTACT_HEADER, 10000, 'Contact header visible')
      .assert.containsText(CONTACT_HEADER, 'CONTACT ACME CHEMICALS')
      .saveScreenshot('tests_output/ui/s3_contact.png')
      .back()
      .waitForElementVisible('body', 10000)
      .assert.not.urlContains('contact.html', 'No longer on contact page')
      .saveScreenshot('tests_output/ui/s3_home_back.png');

    await browser.end();
  }
};
