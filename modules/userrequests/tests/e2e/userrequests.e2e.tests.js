'use strict';

describe('Userrequests E2E Tests:', function () {
  describe('Test Userrequests page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userrequests');
      expect(element.all(by.repeater('userrequest in userrequests')).count()).toEqual(0);
    });
  });
});
