
	/*
		Sound Settings Page
	*/
	
	Component.bugcraft.pageSettingsSound = function( args )
	{
		var soundSettingsPageObject = document.getElementById( args.id + '_soundSettingsPage' );
		
		// check whether to save anything to the system
		var _performTransactionChecker = function()
		{
			if( _performTransaction == false )
			{
				return;
			}
			
			_performTransaction = false;
			
			Application.websocket.handlers.userSettingsSet = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					Application.debug.addError( "Error saving settings" );
				}
				
				
			}
			
			Application.websocket.socket.send( '{"c":"userSettingsSet", "v":' + spellEffects.voiceVolume + ',"m":' + Component.bugcraft.sound.zone.volume + ',"e":' + spellEffects.globalVolume + ',"a":' + spellEffects.ambientalVolume + '}' );
		}
		
		// check which state should be handled
		if( typeof Component.bugcraft.initializedPages.soundSettings != "undefined" )
		{
			Component.bugcraft.initializedPages.soundSettings = !Component.bugcraft.initializedPages.soundSettings;
			soundSettingsPageObject.className = Component.bugcraft.initializedPages.soundSettings ? "settingsSound" : "hidden";
			
			if( !Component.bugcraft.initializedPages.soundSettings )
			{
				_performTransactionChecker();
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			return;
		}
		
		Component.bugcraft.initializedPages.soundSettings = true;
		soundSettingsPageObject.className = "settingsSound";
		
		var soundSettingsCloseButtonObject = document.getElementById( args.id + "_soundSettingsCloseButton" ),
			sliderContainer1Object = document.getElementById( args.id + "_sliderContainer1" ),
			sliderContainer2Object = document.getElementById( args.id + "_sliderContainer2" ),
			sliderContainer3Object = document.getElementById( args.id + "_sliderContainer3" ),
			sliderContainer4Object = document.getElementById( args.id + "_sliderContainer4" ),
			sliderButton1Object = document.getElementById( args.id + "_sliderButton1" ),
			sliderButton2Object = document.getElementById( args.id + "_sliderButton2" ),
			sliderButton3Object = document.getElementById( args.id + "_sliderButton3" ),
			sliderButton4Object = document.getElementById( args.id + "_sliderButton4" ),
			_performTransaction = false;
		
		// "close" button event
		Application.event.add( soundSettingsCloseButtonObject, "click", 	function()
		{
			_performTransactionChecker();
			
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.soundSettings = !Component.bugcraft.initializedPages.soundSettings;
			soundSettingsPageObject.className = "hidden";
		});
		
		var _createSlider = function( sliderArgs )
		{
			var _maxX = sliderArgs.container.offsetWidth - 38;
			
			if( sliderArgs.value )
			{
				sliderArgs.button.style.marginLeft = ( sliderArgs.value * ( _maxX / 100 ) ) + "px";
			}
			
			Application.event.add( sliderArgs.button, "mousedown", function( e )
			{
				var _x = Application.util.style.getCurrent( sliderArgs.button, "marginLeft" ), _containerLeft = Application.util.style.getPos( sliderArgs.container ).left, _t = null;
				
				var _removeFunction = function()
				{
					clearTimeout( _t );
					
					Application.event.remove( document.body, "mousemove", _moveFunction );
					Application.event.remove( document.body, "mouseup", _removeFunction );
				}
				
				var _moveFunction = function( eF )
				{
					_x = Math.max( eF.x - _containerLeft - 20, 0 );
				}
				
				var _sliderPositionChange = function()
				{
					if( _x > _maxX	)
					{
						_x = _maxX;
					}
					
					sliderArgs.button.style.marginLeft = _x + "px";
					
					sliderArgs.onChange( Math.round( _x / ( _maxX / 100 ) ) );
					
					_t = setTimeout( _sliderPositionChange, 40 );
				}
				
				_sliderPositionChange();
				
				Application.event.add( document.body, "mousemove", _moveFunction );
				Application.event.add( document.body, "mouseup", _removeFunction );
			});
		}
		
		// voice
		_createSlider({
					container: sliderContainer1Object,
					button: sliderButton1Object,
					value: spellEffects.voiceVolume,
					onChange: function( sliderValue )
					{
						spellEffects.voiceVolume = sliderValue;
						Component.bugcraft.sound.characters.volume = sliderValue;
						
						_performTransaction = true;
					}
				});
		
		// music
		_createSlider({
					container: sliderContainer2Object,
					button: sliderButton2Object,
					value: Component.bugcraft.sound.zone.volume,
					onChange: function( sliderValue )
					{
						Component.bugcraft.sound.zone.changeVolume( sliderValue );
						Component.bugcraft.sound.screen.changeVolume( sliderValue );
						
						_performTransaction = true;
					}
				});
		
		// effects
		_createSlider({
					container: sliderContainer3Object,
					button: sliderButton3Object,
					value: spellEffects.globalVolume,
					onChange: function( sliderValue )
					{
						Component.bugcraft.sound.ui.volume = sliderValue;
						spellEffects.globalVolume = sliderValue;
						
						_performTransaction = true;
					}
				});
		
		// ambiental
		_createSlider({
					container: sliderContainer4Object,
					button: sliderButton4Object,
					value: spellEffects.ambientalVolume,
					onChange: function( sliderValue )
					{
						spellEffects.ambientalVolume = sliderValue;
						
						_performTransaction = true;
					}
				});
		
		// scale the window
		Component.bugcraft.scaleWindow( soundSettingsPageObject );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	