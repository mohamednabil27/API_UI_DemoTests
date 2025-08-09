// CommonJS export (works regardless of ESM setting)
module.exports = {
  url: 'http://automationpractice.multiformis.com',
  elements: {
    searchInput: '#search_query_top',
    searchButton: 'button[name="submit_search"]'
  },
  commands: [{
    search(term) {
      return this
        .waitForElementVisible('@searchInput', 10000)
        .clearValue('@searchInput')
        .setValue('@searchInput', term)
        .click('@searchButton');
    }
  }]
};
