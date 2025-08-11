// page-objects/dress/home.js
module.exports = {
  url: 'https://automationpractice.multiformis.com/index.php',

  commands: [{
    search(term) {
      const api = this.api;

      // Bypass Chrome HTTPS interstitial if present (Advanced → Proceed)
      const bypassChromeInterstitial = (done) => {
        api.execute(function () {
          return {
            hasDetails: !!document.querySelector('#details-button'),
            hasProceed: !!document.querySelector('#proceed-link') ||
                        !!document.querySelector('#proceed-button') ||
                        !!document.querySelector('#primary-button')
          };
        }, [], ({ value }) => {
          const { hasDetails } = value || {};
          if (hasDetails) {
            api.click('#details-button');
          }
          api.pause(200).execute(function () {
            const el = document.querySelector('#proceed-link, #proceed-button, #primary-button');
            if (el) { el.click(); return true; }
            return false;
          }, [], () => done());
        });
      };

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
        .perform(bypassChromeInterstitial)                     // <-- new: click through interstitial if present
        .getTitle(t => api.perform(() => console.log('Title:', t.value)))
        .url(u => api.perform(() => console.log('URL:', u.value)))
        .perform(() => snap('landing'))
        // detect any available search input
        .execute(function (sels) {
          for (const sel of sels) if (document.querySelector(sel)) return sel;
          return null;
        }, [inputSels], ({ value: inputSel }) => {
          if (inputSel) {
            // found an input → type & click the paired button
            api
              .waitForElementVisible(inputSel, 20000)
              .clearValue(inputSel)
              .setValue(inputSel, term)
              .execute(function (sels) {
                for (const sel of sels) if (document.querySelector(sel)) return sel;
                return null;
              }, [btnSels], ({ value: btnSel }) => {
                api.assert.ok(!!btnSel, 'Search button found on page');
                api.click(btnSel);
              });
          } else {
            // no input visible → FALLBACK to direct search URL
            const q = encodeURIComponent(term);
            const direct = `https://automationpractice.multiformis.com/index.php?controller=search&search_query=${q}`;
            console.log('Fallback to direct search URL:', direct);
            api.url(direct).perform(() => snap('fallback-search'));
          }
        });
    }
  }]
};
