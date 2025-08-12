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

    let step = 1;
    const ss = (label) => browser.saveScreenshot(`tests_output/ui/S3-website/${String(step++).padStart(2,'0')}-${label}.png`);

    // i) Open the page and verify page loaded
    await browser
      .url(BASE_URL)
      .waitForElementVisible('body', 5000, 'Body visible')
      .waitForElementVisible(sel.homeMarker, 5000, 'Home marker visible');
      await ss('home-loaded');

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
      await ss('home-contact');

    // iii) Click Back from browser and assert user at home page
    await browser
      .back()
      .waitForElementVisible('body', 5000)
      .waitForElementVisible(sel.homeMarker, 5000, 'Back on home page')
      .assert.not.urlContains('contact.html', 'No longer on contact page');
      await ss('Back-again');

    await browser.end();
  }
};
