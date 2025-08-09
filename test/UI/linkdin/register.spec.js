const user = require('../../../data/linkedin_user.json');

module.exports = {
  '@tags': ['linkedin', 'e2e'],

  'Register flow shows security verification (POM + data)': async function (browser) {
    const register = browser.page.linkedinRegister();

    // i. Open the page and verify page loaded
    register.openHome();

    browser.assert.titleContains('LinkedIn'); // lightweight sanity check

    // ii. Click on join Now
    register.clickJoinNow();

   
    // iii. Enter email & password
    register.fillEmailAndPassword(user);

    // iv. Click Agree & join
    register.submitEmailAndPassword();

    
    // v. Enter First and Last Name
    register.fillNames(user);

     
    // // vi. Click Continue and assert security verification is shown
    register.continueAfterNames();

            register.assertSecurityVerificationShown();


    //If you want to end explicitly:
    await browser.end();
  }
};
