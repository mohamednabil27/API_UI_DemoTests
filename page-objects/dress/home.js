// page-objects/dress/home.js
module.exports = {
  url: 'http://automationpractice.multiformis.com/',

  commands: [{
    search(term) {
      const api = this.api;

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

      return api
        .waitForElementPresent('body', 10000)
        .saveScreenshot('tests_output/ui/landing.png')
        // find active input
        .execute(function (sels) {
          for (const sel of sels) {
            const el = document.querySelector(sel);
            if (el) return sel;
          }
          return null;
        }, [inputSels], ({ value: inputSel }) => {
          api.assert.ok(!!inputSel, 'Search input found on page');

          api
            .waitForElementVisible(inputSel, 20000)
            .clearValue(inputSel)
            .setValue(inputSel, term)
            .keys(api.Keys.ENTER)  // also submit via Enter
            // find active button (belt & suspenders)
            .execute(function (sels) {
              for (const sel of sels) {
                const el = document.querySelector(sel);
                if (el) return sel;
              }
              return null;
            }, [btnSels], ({ value: btnSel }) => {
              if (btnSel) api.click(btnSel);
            })
            .pause(500); // let navigation happen
        });
    }
  }]
};
