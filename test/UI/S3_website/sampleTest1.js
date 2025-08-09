// tests/home_to_contact.spec.js
module.exports = {
  '@tags': ['smoke'],

  'Home → Contact → Back to Home': async (browser) => {
    const BASE_URL = 'http://s3-design-sample-site.s3-website-us-west-2.amazonaws.com/';

    const sel = {
      homeMarker: 'img[src="images/nav/home1g.gif"]',
      contactLink: 'a[href="contact.html"]',
      contactHeaderXPath: '//p[normalize-space(.)="CONTACT ACME CHEMICALS"]',
    };

    // i) Open the page and verify page loaded
    await browser
      .url(BASE_URL)
      .waitForElementVisible('body', 5000, 'Body visible')
      .waitForElementVisible('a[href="contact.html"]', 8000, 'Contact link visible');

    // ii) Navigate to Contact and assert contact page loaded
    await browser
      .waitForElementVisible(sel.contactLink, 5000, 'Contact link visible')
      .click(sel.contactLink)
      .waitForElementVisible('body', 5000)
      .assert.urlContains('contact.html', 'URL includes contact.html')
      .useXpath()
      .waitForElementVisible(sel.contactHeaderXPath, 5000, 'Contact header visible')
      .assert.containsText(sel.contactHeaderXPath, 'CONTACT ACME CHEMICALS')
      .useCss();

    // iii) Click Back from browser and assert user at home page
    await browser
      .back()
      .waitForElementVisible('body', 5000)
      .waitForElementVisible(sel.homeMarker, 5000, 'Back on home page')
      .assert.not.urlContains('contact.html', 'No longer on contact page');

    await browser.end();
  }
};
