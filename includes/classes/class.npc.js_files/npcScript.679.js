
	
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
														
		var pathConstant_42 = [{"x":2598,"y":2594},{"x":2639,"y":2528},{"x":2643,"y":2495},{"x":2781,"y":2468},{"x":2907,"y":2542},{"x":2874,"y":2625},{"x":2730,"y":2645},{"x":2611,"y":2648},{"x":2546,"y":2762},{"x":2466,"y":2748}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_42,
	
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
	