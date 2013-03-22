
	
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
														
		var pathConstant_41 = [{"x":2071,"y":2325},{"x":2177,"y":2278},{"x":2187,"y":2210},{"x":2179,"y":2155},{"x":2068,"y":2183},{"x":1989,"y":2105},{"x":1975,"y":2038},{"x":1922,"y":2035},{"x":1870,"y":2100},{"x":1890,"y":2208},{"x":1978,"y":2242},{"x":2033,"y":2269}];
														
		
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
	