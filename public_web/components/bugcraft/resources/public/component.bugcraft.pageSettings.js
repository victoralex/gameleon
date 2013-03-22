
	/*
		Market page
	*/
	
	Component.bugcraft.pageSettings = function( args )
	{
		var settingsPageObject = document.getElementById( args.id + '_settingsPage' );
		
		if( typeof Component.bugcraft.initializedPages.settings != "undefined" )
		{
			Component.bugcraft.initializedPages.settings = !Component.bugcraft.initializedPages.settings;
			settingsPageObject.className = Component.bugcraft.initializedPages.settings ? "settingsPage" : "hidden";
			
			return;
		}
		
		Component.bugcraft.initializedPages.settings = true;
		settingsPageObject.className = "settingsPage";
		
		var returnToGameButtonObject = document.getElementById( args.id + "_returnToGameButton" ),
				videoSettingsButtonObject = document.getElementById( args.id + "_videoSettingsButton" ),
				interfaceSettingsButtonObject = document.getElementById( args.id + "_interfaceSettingsButton" ),
				soundSettingsButtonObject = document.getElementById( args.id + "_soundSettingsButton" ),
				logoutButtonObject = document.getElementById( args.id + "_logoutButton" );
		
		// sound settings button
		Application.event.add( soundSettingsButtonObject, "click", function( e )
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
			
			Component.bugcraft.pageSettingsSound( args );
			
			Component.bugcraft.initializedPages.settings = false;
			settingsPageObject.className = 'hidden';
		});
		
		// return to game button
		Application.event.add( returnToGameButtonObject, "click", function( e )
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
			
			Component.bugcraft.initializedPages.settings = false;
			settingsPageObject.className = 'hidden';
		});
		
		// logout button
		Application.event.add( logoutButtonObject, "click", function( e )
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
			
			Application.websocket.handlers.characterLogout = function( jsonEl, ws )
			{
				Component.bugcraft.initializedPages.settings = false;
				settingsPageObject.className = 'hidden';
				
				Application.websocket.handlers.characterLogoutCancel = function( jsonEl, ws )
				{
					_dc.remove();
				}
				
				var _dc = new Component.bugcraft.notificationPopup.disconnectCountdown({
																												id: args.id,
																												notificationText: "You will be auto logged out in [seconds] seconds ",
																												cancelLogoutText: "Cancel",
																												timeoutMiliseconds: jsonEl.t,
																												onCancel: function()
																												{
																													Application.websocket.socket.send( '{"c":"characterLogoutCancel"}' );
																												}
																											});
				
			}
			
			Application.websocket.socket.send( '{"c":"characterLogout"}' );
		});
	}
	