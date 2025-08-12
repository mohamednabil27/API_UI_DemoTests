// page-objects/dress/home.js
module.exports = {
  url: 'http://automationpractice.multiformis.com/',

  commands: [{
    search(term) {
      const api = this.api;
      const baseUrl = this.url;

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

      const snap = (name) => api.saveScreenshot(`tests_output/ui/${name}.png`);

      return api
        .waitForElementPresent('body', 10000)

        // 1) Bypass Chrome interstitial if present (JS click to avoid "not interactable")
        .perform((done) => {
          api.execute(function () {
            const detailsSel = '#details-button, #advancedButton, #more-information-button';
            const proceedSel = '#proceed-link, #proceed-button, #primary-button';

            const details = document.querySelector(detailsSel);
            if (details) details.click();

            setTimeout(() => {
              const proceed = document.querySelector(proceedSel);
              if (proceed) proceed.click();
            }, 150);

            return true;
          }, [], () => done());
        })
        .pause(400)

        // 2) If Chrome landed on a blank/error page, force reload of the real URL once
        .url(({ value }) => {
          const bad = !value || value.startsWith('data:') || /chrome-error|chromewebdata/i.test(value);
          if (bad) api.url(baseUrl).pause(400);
        })

        .perform(() => snap('landing'))

        // 3) Find a usable search input on whatever theme is loaded
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
            .keys(api.Keys.ENTER) // some themes submit on Enter

            // also try a visible search button (covers themes that ignore Enter)
            .execute(function (sels) {
              for (const sel of sels) {
                const el = document.querySelector(sel);
                if (el) return sel;
              }
              return null;
            }, [btnSels], ({ value: btnSel }) => {
              if (btnSel) api.click(btnSel);
            })
            .pause(500)

            // 4) Ensure we are on the search results page; fallback direct URL if not
            .url((res) => {
              const u = (res && res.value) || '';
              if (!/search_query=|controller=search/i.test(u)) {
                const q = encodeURIComponent(term);
                const direct = `${baseUrl.indexOf('https') === 0 ? 'https://automationpractice.multiformis.com' : 'http://automationpractice.multiformis.com'}/index.php?controller=search&search_query=${q}`;
                api.url(direct);
              }
            })
            .perform(() => snap('after-search'));
        });
    }
  }]
};
