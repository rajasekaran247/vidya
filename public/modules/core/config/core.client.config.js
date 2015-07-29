'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
    
      Menus.addMenuItem('topbar', 'System Admin', 'systemadmin', 'dropdown');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Institution', 'institutions');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Branch', 'branches');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Trustee', 'trustees');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Management Team', 'management-teams');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Infrastructure', 'infrastructures');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Building', 'buildings');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Classroom', 'class-rooms');
      
      Menus.addSubMenuItem('topbar', 'systemadmin', 'List Vehicle', 'vehicles');
      
    
	}
]);
