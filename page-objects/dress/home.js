// page-objects/dress/home.js
module.exports = {
  url: 'https://automationpractice.multiformis.com/index.php',

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

      // tiny helper to log & snapshot what CI actually loaded
      const snap = (name) => this.api.saveScreenshot(`tests_output/ui/${name}.png`);

      return this.api
        .waitForElementPresent('body', 10000)
        .getTitle(t => this.api.perform(() => console.log('Title:', t.value)))
        .url(u => this.api.perform(() => console.log('URL:', u.value)))
        .perform(() => snap('landing'))
        // detect any available search input
        .execute(function (sels) {
          for (const sel of sels) if (document.querySelector(sel)) return sel;
          return null;
        }, [inputSels], ({ value: inputSel }) => {
          if (inputSel) {
            // found an input → type & click the paired button
            this.api
              .waitForElementVisible(inputSel, 20000)
              .clearValue(inputSel)
              .setValue(inputSel, term)
              .execute(function (sels) {
                for (const sel of sels) if (document.querySelector(sel)) return sel;
                return null;
              }, [btnSels], ({ value: btnSel }) => {
                this.api.assert.ok(!!btnSel, 'Search button found on page');
                this.api.click(btnSel);
              });
          } else {
            // no input visible → FALLBACK to direct search URL
            const q = encodeURIComponent(term);
            const direct = `https://automationpractice.multiformis.com/index.php?controller=search&search_query=${q}`;
            console.log('Fallback to direct search URL:', direct);
            this.api.url(direct).perform(() => snap('fallback-search'));
          }
        });
    }
  }]
};
