'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
    
      Menus.addMenuItem('topbar', 'System Admin', 'systemadmin', 'dropdown');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'Constitution', 'constitutions');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'Institution', 'institutions');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'Owner Member', 'owner-members');
      
    
	}
]);
