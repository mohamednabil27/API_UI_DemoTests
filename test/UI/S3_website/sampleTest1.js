// tests/home_to_contact.spec.js
module.exports = {
  '@tags': ['smoke'],

  'Home → Contact → Back to Home': async (browser) => {
    const BASE_URL = 'http://s3-design-sample-site.s3-website-us-west-2.amazonaws.com/';

    // Robust "Contact" locator: href contains, image src contains, OR visible text contains "contact" (any case)
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
      .waitForElementVisible('body', 10000, 'Body visible')
      .saveScreenshot('tests_output/ui/s3_home.png')
      .waitForElementVisible(CONTACT_ANY, 15000, 'Contact link/button visible');

    await browser
      .click(CONTACT_ANY)
      .waitForElementVisible('body', 10000)
      .assert.urlContains('contact.html', 'URL includes contact.html')
      .waitForElementVisible(CONTACT_HEADER, 10000, 'Contact header visible')
      .assert.containsText(CONTACT_HEADER, 'CONTACT ACME CHEMICALS')
      .saveScreenshot('tests_output/ui/s3_contact.png');

    await browser
      .back()
      .waitForElementVisible('body', 10000)
      .assert.not.urlContains('contact.html', 'No longer on contact page')
      .waitForElementVisible(CONTACT_ANY, 10000, 'Back on home page (Contact visible)')
      .saveScreenshot('tests_output/ui/s3_home_back.png');

    await browser.end();
  }
};
