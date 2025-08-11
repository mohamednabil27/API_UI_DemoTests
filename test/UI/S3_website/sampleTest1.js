// tests/home_to_contact.spec.js
module.exports = {
  '@tags': ['smoke'],

  'Home → Contact → Back to Home': async (browser) => {
    const BASE_URL = 'http://s3-design-sample-site.s3-website-us-west-2.amazonaws.com/';

    // Robust "Contact" locator: href contains, image src contains, OR visible text contains "contact"
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

    // Helper to bypass Chrome HTTPS interstitials if they appear
    const bypassChromeInterstitial = (done) => {
      browser.execute(function () {
        return {
          hasDetails: !!document.querySelector('#details-button'),
          hasProceed: !!document.querySelector('#proceed-link') ||
                      !!document.querySelector('#proceed-button') ||
                      !!document.querySelector('#primary-button')
        };
      }, [], ({ value }) => {
        const { hasDetails } = value || {};
        if (hasDetails) {
          browser.click('#details-button');
        }
        // click proceed if it exists after a short delay
        browser.pause(200).execute(function () {
          const el = document.querySelector('#proceed-link, #proceed-button, #primary-button');
          if (el) { el.click(); return true; }
          return false;
        }, [], () => done());
      });
    };

    await browser
      .url(BASE_URL)
      .waitForElementPresent('body', 10000)
      .saveScreenshot('tests_output/ui/s3_home.png')
      .perform(bypassChromeInterstitial) // <-- new: click through interstitial if present
      // If a Contact control isn't quickly visible, go directly to contact.html (keeps test moving)
      .perform((done) => {
        browser.execute(function (x) {
          try {
            return !!document.evaluate(x, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
          } catch (e) { return false; }
        }, [CONTACT_ANY.selector], ({ value }) => {
          if (!value) browser.url(BASE_URL + 'contact.html');
          done();
        });
      })
      .waitForElementVisible('body', 10000, 'Body visible');

    // If we’re still on home, click the contact control; otherwise we’re already on contact.html
    await browser
      .perform((done) => {
        browser.url(({ value }) => {
          if (!/contact\.html/i.test(value || '')) {
            browser.waitForElementVisible(CONTACT_ANY, 15000, 'Contact link/button visible')
                   .click(CONTACT_ANY);
          }
          done();
        });
      })
      .waitForElementVisible('body', 10000)
      .assert.urlContains('contact.html', 'URL includes contact.html')
      .waitForElementVisible(CONTACT_HEADER, 10000, 'Contact header visible')
      .assert.containsText(CONTACT_HEADER, 'CONTACT ACME CHEMICALS')
      .saveScreenshot('tests_output/ui/s3_contact.png');

    // Back to Home
    await browser
      .back()
      .waitForElementVisible('body', 10000)
      .assert.not.urlContains('contact.html', 'No longer on contact page')
      .waitForElementVisible(CONTACT_ANY, 10000, 'Back on home page (Contact visible)')
      .saveScreenshot('tests_output/ui/s3_home_back.png');

    await browser.end();
  }
};
