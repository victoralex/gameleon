
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	 
		var timerObject = require( "../class.timer" ).timer;
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var questIdConstant_22 = 53;
														
		var questParameterNameConstant_23 = "q53_1BeachBugsKilled";
														
		var numberConstant_24 = 1;
														
		var thisCharacterObjectConstant_25 = npcObject;
														
		var thisCharacterObjectConstant_26 = npcObject;
														
		var pathConstant_29 = [{"x":1166,"y":3070},{"x":1045,"y":3068},{"x":1015,"y":2962},{"x":1069,"y":2909},{"x":1153,"y":2911},{"x":1254,"y":2919},{"x":1286,"y":2961},{"x":1284,"y":3042},{"x":1279,"y":3126},{"x":1255,"y":3167},{"x":1157,"y":3097}];
														
		var timerObjectConstant_47 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_48 = 30000;
														
		var positiveNumberConstant_49 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_26,
	movePath: pathConstant_29,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_4 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_4,
	questId: questIdConstant_22,
	parameterName: questParameterNameConstant_23,
	value: numberConstant_24,
	
														}
													);
	timerObjectConstant_47.startTimer({
			minDelay: positiveNumberConstant_48,
	maxDelay: positiveNumberConstant_49,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_25.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_25
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
	