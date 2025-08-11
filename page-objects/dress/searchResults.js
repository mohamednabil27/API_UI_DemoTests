module.exports = {
  elements: {
    center: '#center_column',
    noResultsAlert: '#center_column .alert-warning',
    productList: '#center_column ul.product_list',
    productNames: '#center_column ul.product_list .product-name'
  },
  commands: [{
    assertHasResults() {
      this.api.expect.element(this.elements.noResultsAlert.selector).to.not.be.present;
      return this.waitForElementVisible('@productList', 10000);
    },
    assertProductNamesContain(term, maxCheck = 5) {
      const sel = this.elements.productNames.selector;
      this.api.elements('css selector', sel, (res) => {
        const items = (res.value || []).slice(0, maxCheck);
        this.api.assert.ok(items.length > 0, 'At least one product appears');
        items.forEach((elRef, i) => {
          const id = elRef.ELEMENT || elRef['element-6066-11e4-a52e-4f735466cecf'];
          this.api.elementIdText(id, (txt) => {
            this.api.assert.ok(
              new RegExp(term, 'i').test(txt.value || ''),
              `Result #${i + 1} title includes "${term}"`
            );
          });
        });
      });
      return this;
    }
  }]
};