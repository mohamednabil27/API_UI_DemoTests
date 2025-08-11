module.exports = async function bypassInterstitial(browser) {
  await browser.perform(done => {
    browser.execute(function () {
      const detailsSel = '#details-button, #advancedButton, #more-information-button';
      const proceedSel = '#proceed-link, #proceed-button, #primary-button';
      return {
        hasDetails: !!document.querySelector(detailsSel),
        detailsSel,
        proceedSel
      };
    }, [], ({ value }) => {
      const { hasDetails, detailsSel, proceedSel } = value || {};
      if (hasDetails) {
        // JS-click to avoid "element not interactable"
        browser.execute(function (sel) {
          const el = document.querySelector(sel);
          if (el) el.click();
        }, [detailsSel]);
      }
      browser.pause(250).execute(function (sel) {
        const el = document.querySelector(sel);
        if (el) { el.click(); return true; }
        return false;
      }, [proceedSel], () => done());
    });
  });
};