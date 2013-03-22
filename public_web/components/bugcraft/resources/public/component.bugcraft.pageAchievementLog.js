
	/*
		Achievement Log page
	*/
	
	Component.bugcraft.pageAchievementLog = function( args )
	{
		// ensure this code is run only once
		
		if( typeof Component.bugcraft.initializedPages.achievementLog != "undefined" )
		{
			Component.bugcraft.initializedPages.achievementLog = !Component.bugcraft.initializedPages.achievementLog;
			//achievementsPageObject.className = ( achievementsPageObject.className == "hidden" ) ? "achievementLog" : "hidden";
			
			if( !Component.bugcraft.initializedPages.achievementLog )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "bookOpen" );
				
				//Component.bugcraft.scaleWindow( achievementsPageObject );
			}
			else
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			return;
		}
		
		Component.bugcraft.initializedPages.achievementLog = true;
		
		//
		// Define internal variables
		//
		
		
		
		//
		// Server Handlers
		//
		
		// get all active achievements in the log
		Application.websocket.handlers.achievementsGetProgress = function( jsonEl, ws )
		{
			console.log( "got progress", jsonEl );
		}
		
		Application.websocket.socket.send( '{"c":"achievementsGetProgress"}' );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	