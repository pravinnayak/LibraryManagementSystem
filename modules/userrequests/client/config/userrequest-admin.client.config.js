(function () {
    'use strict';
  
    // Configuring the Articles Admin module
    angular
      .module('userrequests.admin')
      .run(menuConfig);
  
    menuConfig.$inject = ['menuService'];
  
    function menuConfig(Menus) {
      Menus.addSubMenuItem('topbar', 'admin', {
        title: 'Manage User Request',
        state: 'admin.userrequests.list'
      });
      Menus.addSubMenuItem('topbar', 'admin', {
        title: 'View All request',
        state: 'admin.userrequests.allRequest'
      });
    }
  }());
  