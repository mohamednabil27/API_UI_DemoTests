module.exports = {
  '@tags': ['search', 'dress'],

  'Search "dress" shows relevant results': function (browser) {
    // NOTE: nested accessor: browser.page.<folder>.<page>()
    const home = browser.page.dress.home();
    const results = browser.page.dress.searchResults();



    home.navigate().search('dress');


    results
      .waitForElementVisible('@center', 10000)
      .assertHasResults()
      .assertProductNamesContain('dress', 5);



    
    browser.debug();
    // browser.end();
  }
};
