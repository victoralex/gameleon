
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	 
		var timerObject = require( "../class.timer" ).timer;
	
	
	
	exports.script = function( npcObject )
	{
		//
		// Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var timerObjectConstant_34 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_35 = 30000;
														
		var positiveNumberConstant_36 = 60000;
														
		var pathConstant_41 = [{"x":2228,"y":2536},{"x":2307,"y":2419},{"x":2482,"y":2395},{"x":2483,"y":2359},{"x":2434,"y":2331},{"x":2384,"y":2252},{"x":2331,"y":2212},{"x":2257,"y":2250},{"x":2268,"y":2353},{"x":2227,"y":2369},{"x":2198,"y":2451}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_41,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	timerObjectConstant_34.startTimer({
			minDelay: positiveNumberConstant_35,
	maxDelay: positiveNumberConstant_36,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_1.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_1
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
	