
	
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
		
		
		var timerObjectConstant_202 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_206 = 10000;
														
		var positiveNumberConstant_207 = 30000;
														
		var thisCharacterObjectConstant_210 = npcObject;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	timerObjectConstant_202.startTimer({
			minDelay: positiveNumberConstant_206,
	maxDelay: positiveNumberConstant_207,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_210.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_210
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
	