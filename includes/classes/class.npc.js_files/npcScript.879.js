
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var timerObject = require( "../class.timer" ).timer;
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var timerObjectConstant_172 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_176 = 15000;
														
		var positiveNumberConstant_177 = 15001;
														
		var thisCharacterObjectConstant_180 = npcObject;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	timerObjectConstant_172.startTimer({
			minDelay: positiveNumberConstant_176,
	maxDelay: positiveNumberConstant_177,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_180.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_180
		});
	
								},
	
		});
	
			});
		
		
		//
		// Post all objects initialisation
		//
		
		this.postInit = function()
		{
			
		}
		
		//
		// Initialize
		//
		
		
		// bind to instance
		npcObject.events._add( "afterInit", function( args )
		{
			npcObject.bindToInstance( _iO, function() { } );
		});
		
	}
	