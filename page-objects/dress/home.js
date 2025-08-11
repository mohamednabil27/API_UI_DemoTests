// page-objects/dress/home.js
module.exports = {
  url: 'http://automationpractice.multiformis.com/',

  commands: [{
    search(term) {
      const inputSels = [
        '#search_query_top',
        'form#searchbox input[name=search_query]',
        '#search_widget input[type=search]',
        'input[name="s"]'
      ];
      const btnSels = [
        'button[name="submit_search"]',
        'form#searchbox button[type=submit]',
        '#search_widget button[type=submit]'
      ];

      return this.api
        .waitForElementPresent('body', 10000)
        .saveScreenshot('tests_output/ui/landing.png') // for CI artifacts
        // find active input
        .execute(function (sels) {
          for (const sel of sels) {
            const el = document.querySelector(sel);
            if (el) return sel;
          }
          return null;
        }, [inputSels], ({ value: inputSel }) => {
          this.api.assert.ok(!!inputSel, 'Search input found on page');

          this.api
            .waitForElementVisible(inputSel, 20000)
            .clearValue(inputSel)
            .setValue(inputSel, term)
            // find active button
            .execute(function (sels) {
              for (const sel of sels) {
                const el = document.querySelector(sel);
                if (el) return sel;
              }
              return null;
            }, [btnSels], ({ value: btnSel }) => {
              this.api.assert.ok(!!btnSel, 'Search button found on page');
              this.api.click(btnSel);
            });
        });
    }
  }]
};
