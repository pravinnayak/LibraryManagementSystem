(function () {
  'use strict';

  angular
    .module('userrequests')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Userrequests',
      state: 'userrequests',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'userrequests', {
      title: 'Manage your request',
      state: 'userrequests.list',
      roles: ['user']
    });

    // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'userrequests', {
    //   title: 'Create Userrequest',
    //   state: 'userrequests.create',
    //   roles: ['user']
    // });
  }
}());
