
	
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
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var polygonIdConstant_32 = "Rope Bridge";
														
		var timerObjectConstant_36 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_37 = 45000;
														
		var positiveNumberConstant_38 = 60000;
														
		var timerObjectConstant_46 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_47 = 45000;
														
		var positiveNumberConstant_48 = 60000;
														
		var polygonIdConstant_54 = "Rope Bridge";
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_3 = args.byCharacterObject;
	timerObjectConstant_46.startTimer({
			minDelay: positiveNumberConstant_47,
	maxDelay: positiveNumberConstant_48,
	onFinalize: function( args )
								{
									thisInstanceObjectConstant_2.surfaceSetObstaclePoly(
			polygonIdConstant_54,
			
								function( args )
								{
									
								}
	
		);
	
								},
	
		});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	thisInstanceObjectConstant_2.surfaceSetWalkablePoly(
			polygonIdConstant_32,
			
								function( args )
								{
									timerObjectConstant_36.startTimer({
			minDelay: positiveNumberConstant_37,
	maxDelay: positiveNumberConstant_38,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_1.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_1
		});
	
								},
	
		});
	
								}
	
		);
	
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
	