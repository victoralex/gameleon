
	/*
		Battleground Statistics
	*/
	
	Component.bugcraft.battlegroundStatistics = function( args, dataToPopulateWith )
	{
		var battlegroundStatisticsPageObject = document.getElementById( args.id + '_battlegroundStatisticsPage' );
		
		if( typeof Component.bugcraft.initializedPages.battlegroundStatistics != "undefined" )
		{
			Component.bugcraft.initializedPages.battlegroundStatistics = !Component.bugcraft.initializedPages.battlegroundStatistics;
			battlegroundStatisticsPageObject.className = Component.bugcraft.initializedPages.battlegroundStatistics ? "battlegroundStatistics" : "hidden";
			
			if( !Component.bugcraft.initializedPages.battlegroundStatistics )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			return;
		}
		
		Component.bugcraft.initializedPages.battlegroundStatistics = true;
		battlegroundStatisticsPageObject.className = "battlegroundStatistics";
		
		var battlegroundStatisticsCloseButtonObject = document.getElementById( args.id + "_battlegroundStatisticsCloseButton" ),
			battlegroundStatisticsLeaveButtonObject = document.getElementById( args.id + "_battlegroundStatisticsLeave" ),
			battlegroundStatisticsListItemsObject = document.getElementById( args.id + "_battlegroundStatisticsListItems" ),
			battlegroundStatisticsItemsContainerObject = document.getElementById( args.id + "_battlegroundStatisticsItemsContainer" ),
			battlegroundStatisticsPlayersAnteriumObject = document.getElementById( args.id + "_battlegroundPlayersAnterium" ),
			battlegroundStatisticsPlayersHegemonyObject = document.getElementById( args.id + "_battlegroundPlayersHegemony" ),
			battlegroundStatisticsDurationObject = document.getElementById( args.id + "_battlegroundDuration" ),
			battlegroundStatisticsListControlUpObject = document.getElementById( args.id + "_battlegroundStatisticsListControlUp" ),
			battlegroundStatisticsListControlDownObject = document.getElementById( args.id + "_battlegroundStatisticsListControlDown" ),
			anteriumCharactersNumber = 0, hegemonyCharactersNumber = 0;
		
		Application.websocket.handlers.battlegroundLeave = function( jsonEl, ws )
		{
			document.location.reload();
		}
		
		// "close" button event
		Application.event.add( battlegroundStatisticsCloseButtonObject, "click", 	function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Application.websocket.socket.send( '{"c":"battlegroundLeave"}' );
		});
		
		// "leave" button event
		Application.event.add( battlegroundStatisticsLeaveButtonObject, "click", 	function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
			Application.websocket.socket.send( '{"c":"battlegroundLeave"}' );
		});
		
		// mouse wheel scroll
		battlegroundStatisticsItemsContainerObject.onmousewheel = function( e )
		{
			var mouseDelta = e.wheelDelta / 10;
			
			if(
				( mouseDelta > 0 && battlegroundStatisticsListItemsObject.offsetTop + mouseDelta <= 0 )
				|| ( mouseDelta < 0 && battlegroundStatisticsListItemsObject.offsetTop + mouseDelta > -battlegroundStatisticsListItemsObject.offsetHeight + battlegroundStatisticsItemsContainerObject.offsetHeight )
			)
			{
				battlegroundStatisticsListItemsObject.style.top = ( battlegroundStatisticsListItemsObject.offsetTop + mouseDelta ) + "px";
			}
			else
			{
				if( mouseDelta > 0 )
				{
					battlegroundStatisticsListItemsObject.style.top = "0px";
				}
				else
				{
					battlegroundStatisticsListItemsObject.style.top = ( -battlegroundStatisticsListItemsObject.offsetHeight + battlegroundStatisticsItemsContainerObject.offsetHeight ) + "px";
				}
			}
			
			return false;
		}
		
		// "up" button event
		Application.event.add( battlegroundStatisticsListControlUpObject, "mousedown", function()
		{
			var _scrollTimeout = null;
			
			var _scrollFunction = function()
			{
				if( battlegroundStatisticsListItemsObject.offsetTop + 6 <= 0 )
				{
					battlegroundStatisticsListItemsObject.style.top = ( battlegroundStatisticsListItemsObject.offsetTop + 6 ) + "px";
				}
				else
				{
					battlegroundStatisticsListItemsObject.style.top = "0px";
				}
				
				_scrollTimeout = setTimeout( _scrollFunction, 100 );
			}
			
			var _scrollRemove = function()
			{
				clearTimeout( _scrollTimeout );
				
				Application.event.remove( document.body, "mouseup", _scrollRemove );
			};
			
			_scrollFunction();
			
			Application.event.add( document.body, "mouseup", _scrollRemove );
		});
		
		// "down" button event
		Application.event.add( battlegroundStatisticsListControlDownObject, "mousedown", function()
		{
			var _scrollTimeout = null;
			
			var _scrollFunction = function()
			{
				if( battlegroundStatisticsListItemsObject.offsetTop - 6 > -battlegroundStatisticsListItemsObject.offsetHeight + battlegroundStatisticsItemsContainerObject.offsetHeight )
				{
					battlegroundStatisticsListItemsObject.style.top = ( battlegroundStatisticsListItemsObject.offsetTop - 6 ) + "px";
				}
				else
				{
					battlegroundStatisticsListItemsObject.style.top = ( -battlegroundStatisticsListItemsObject.offsetHeight + battlegroundStatisticsItemsContainerObject.offsetHeight ) + "px";
				}
				
				_scrollTimeout = setTimeout( _scrollFunction, 100 );
			}
			
			var _scrollRemove = function()
			{
				clearTimeout( _scrollTimeout );
				
				Application.event.remove( document.body, "mouseup", _scrollRemove );
			};
			
			_scrollFunction();
			
			Application.event.add( document.body, "mouseup", _scrollRemove );
		});
		
		//
		// List the players
		//
		
		for(var i in dataToPopulateWith.s)
		{
			var _c = dataToPopulateWith.s[ i ];
			
			( _c.faction == "anterium" ) ? ( anteriumCharactersNumber++ ) : ( hegemonyCharactersNumber++ );
			
			var characterStatLine = document.createElement("div");
			characterStatLine.innerHTML = '<div class="battlegroundListItem"><div class="tableRowClassIcon' + _c["class"] + '"></div><div class="tableRowPlayerName">' + _c.name + '</div><div class="tableRow">' + ( _c.kills_direct ? _c.kills_direct : 0 ) + '</div><div class="tableRow">' + ( _c.deaths ? _c.deaths : 0 ) + '</div><div class="tableRow">' + ( _c.kills_glory ? _c.kills_glory : 0 ) + '</div><div class="tableRow">' + ( _c.buff_damaged_points ? _c.buff_damaged_points : 0 ) + '</div><div class="tableRow">' + ( _c.buff_healed_points ? _c.buff_healed_points : 0 ) + '</div><div class="tableRow">' + ( _c.flag_captures ? _c.flag_captures : 0 ) + '</div><div class="tableRow">' + ( _c.flag_returns ? _c.flag_returns : 0 ) + '</div><div class="tableRow">' + ( _c.glory_earned ? _c.glory_earned : 0 ) + '</div></div>';
			
			battlegroundStatisticsListItemsObject.appendChild( characterStatLine );
		}
		
		Component.bugcraft.scaleWindow( battlegroundStatisticsPageObject );
		
		// overall statistics
		battlegroundStatisticsDurationObject.innerHTML = Math.floor( dataToPopulateWith.d / 60 ) + "m " + ( dataToPopulateWith.d % 60 ) + "s";
		battlegroundStatisticsPlayersAnteriumObject.innerHTML = anteriumCharactersNumber;
		battlegroundStatisticsPlayersHegemonyObject.innerHTML = hegemonyCharactersNumber;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	