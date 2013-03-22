	
	/*
		Profile page
	*/
	
	Component.bugcraft.pageBags = function( args )
	{
		var bagsPageObject = document.getElementById( args.id + '_bagsPage' );
		
		// ensure this code is run only once
		if( typeof Component.bugcraft.initializedPages.pageBags != "undefined" )
		{
			Component.bugcraft.initializedPages.pageBags = !Component.bugcraft.initializedPages.pageBags;
			bagsPageObject.className = ( bagsPageObject.className == "hidden" ) ? "pageBags" : "hidden";
			
			if( !Component.bugcraft.initializedPages.pageBags )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "backPack" );
			}
			else
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			return;
		}
		
		if( !args.hidden )
		{
			bagsPageObject.className = "pageBags";
			Component.bugcraft.sound.ui.playEvent( "window", "backPack" );
		}
		
		Component.bugcraft.initializedPages.pageBags = true;
		
		// bags hide
		Component.bugcraft.pageBagsHide = function()
		{
			Component.bugcraft.initializedPages.pageBags = true;
			bagsPageObject.className = "hidden";
		}
		
		// player currency
		Component.bugcraft.pageBagsUpdatePlayerCurrency = function()
		{
			// will create the cost content for an item / player
			var _getCostContent = function( costData )
			{
				var costContent = '';
				
				costContent += '<span class="amber" title="Amber">' + costData.amber + '</span>';
				
				if( costData.polen > 10000 )
				{
					// refined polen
					
					costContent += '<span class="polenRefined" title="Refined Polen">' + Math.floor( costData.polen / 10000 ) + '</span>';
					
					if( Math.floor( ( costData.polen % 10000 ) / 100 ) > 0 )
					{
						costContent += '<span class="polenRegular" title="Regular Polen">' + Math.floor( ( costData.polen % 10000 ) / 100 ) + '</span>';
						
						if( Math.floor( costData.polen % 100 ) > 0 )
						{
							costContent += '<span class="polenCrude" title="Crude Polen">' + Math.floor( costData.polen % 100 ) + '</span>';
						}
					}
				}
				else if( costData.polen > 100 )
				{
					// regular polen
					
					costContent += '<span class="polenRegular" title="Regular Polen">' + Math.floor( costData.polen / 100 ) + '</span>';
					
					if( Math.floor( costData.polen % 100 ) )
					{
						costContent += '<span class="polenCrude" title="Crude Polen">' + Math.floor( costData.polen % 100 ) + '</span>';
					}
				}
				else
				{
					// only crude polen in the bag
					
					costContent += '<span class="polenCrude" title="Crude Polen">' + costData.polen + '</span>';
				}
				
				return costContent;
			}
			
			bagsCurrencyObject.innerHTML = _getCostContent({
																			polen: _ccd.character_polen,
																			amber: _ccd.character_amber
																		});
		}
		
		//
		// Define internal variables
		//
		
		var _ccd = Component.bugcraft.currentCharacterObject.characterData,
			bagsCloseButtonObject = document.getElementById( args.id + '_bagsCloseButton' ),
			bagsCurrencyObject = document.getElementById( args.id + '_bagsCurrency' );
		
		// "close" button event
		Application.event.add( bagsCloseButtonObject, "click", function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.pageBags = !Component.bugcraft.initializedPages.pageBags;
			
			bagsPageObject.className = 'hidden';
		});
		
		/*
			-- Important notice --
			-- the bags content is updated from the profile page --
		*/
		
		Component.bugcraft.pageBagsUpdatePlayerCurrency();
	}
	
	Component.bugcraft.pageBagsUpdatePlayerCurrency = function()
	{
	
	}
	
	Component.bugcraft.pageBagsHide = function()
	{
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	