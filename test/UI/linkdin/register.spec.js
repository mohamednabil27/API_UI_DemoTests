// test/UI/linkdin/register.spec.js
const user = require('../../../data/linkedin_user.json');

module.exports = {
  '@tags': ['linkedin', 'e2e'],

  'Register flow shows security verification (POM + data)': async function (browser) {
    const register = browser.page.linkdin.linkedinRegister();

    // simple numbered screenshot helper
    let step = 1;
    const ss = (label) => browser.saveScreenshot(`tests_output/ui/linkedin/${String(step++).padStart(2,'0')}-${label}.png`);

    try {
      // i. Open the page and verify page loaded
      register.openHome();
      await ss('home-loaded');

      browser.assert.titleContains('LinkedIn'); // lightweight sanity check
      await ss('title-checked');

      // ii. Click on join Now
      register.clickJoinNow();
      await ss('clicked-join-now');

      // iii. Enter email & password
      register.fillEmailAndPassword(user);
      await ss('filled-email-password');

      // iv. Click Agree & join
      register.submitEmailAndPassword();
      await ss('submitted-credentials');

      // v. Enter First and Last Name
      register.fillNames(user);
      await ss('filled-names');

      // vi. Continue & assert security verification is shown
      register.continueAfterNames();
      await ss('after-continue');

      register.assertSecurityVerificationShown();
      await ss('security-verification-visible');
    } finally {
      await browser.end(); // will still run even if an assertion fails
    }
  }
};
