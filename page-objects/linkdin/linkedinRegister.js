module.exports = {
  url: 'https://www.linkedin.com/',

  elements: {
    body: 'body',

    // HOME
    joinNowButton:{

    selector: "//a[@data-tracking-control-name='guest_homepage-basic_nav-header-join']",
    locateStrategy: 'xpath'
    }, 

    // STEP 1 (email + password)
    emailInput: 'input[name="email-address"]',
    passwordInput: 'input[name="password"]',
    agreeAndJoinButton: 'button[class="join-form__form-body-submit-button "]',

    // STEP 2 (first + last name)
    firstNameInput: 'input[name="first-name"]',
    lastNameInput: 'input[name="last-name"]',
    continueButton: 'button[id="join-form-submit"]',

    // SECURITY / CAPTCHA
    securityVerificationContainer: 'h2[id="challenge-dialog-modal-header"]'
  },

  commands: [{
    openHome() {
      return this.navigate().waitForElementVisible('@body');
    },
    clickJoinNow() {
        return this
        .waitForElementPresent('@joinNowButton', 10000) // present first (less strict)
        .click('@joinNowButton');
    },
    fillEmailAndPassword({ email, password }) {
      return this.waitForElementVisible('@emailInput')
        .setValue('@emailInput', email)
        .setValue('@passwordInput', password);
    },
    submitEmailAndPassword() {
      return this.waitForElementVisible('@agreeAndJoinButton').click('@agreeAndJoinButton');
    },
    fillNames({ firstName, lastName }) {
      return this.waitForElementVisible('@firstNameInput')
        .setValue('@firstNameInput', firstName)
        .setValue('@lastNameInput', lastName);
    },
    continueAfterNames() {
      return this.waitForElementVisible('@continueButton').click('@continueButton');
    },
    assertSecurityVerificationShown() {
       this.waitForElementVisible('@securityVerificationContainer', 15000);

    this.expect.element('@securityVerificationContainer')
    .text.to.equal('Security verification')
    .before(15000);

    return this;
    }
  }]
};
