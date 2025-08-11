// test/UI/Dress/search-dress.e2e.js
module.exports = {
  '@tags': ['search', 'dress'],

  'Search "dress" shows relevant results': function (browser) {

    const home = browser.page.dress.home();
    const results = browser.page.dress.searchResults();

    home.navigate().search('dress');

    results
      .waitForElementVisible('@center', 10000)
      .assertHasResults()
      .assertProductNamesContain('dress', 5);

    browser.end();
  }
};
