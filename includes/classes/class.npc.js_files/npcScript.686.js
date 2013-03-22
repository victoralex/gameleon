
	
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
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var pathConstant_33 = [{"x":1008,"y":1484},{"x":931,"y":1446},{"x":1203,"y":1420},{"x":1245,"y":1527},{"x":1098,"y":1567},{"x":909,"y":1519},{"x":1046,"y":1516}];
														
		var questIdConstant_38 = 75;
														
		var questParameterNameConstant_39 = "q75_1ForlornStalkersKilled";
														
		var numberConstant_40 = 1;
														
		var timerObjectConstant_44 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_45 = 30000;
														
		var positiveNumberConstant_46 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_33,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_38,
	parameterName: questParameterNameConstant_39,
	value: numberConstant_40,
	
														}
													);
	timerObjectConstant_44.startTimer({
			minDelay: positiveNumberConstant_45,
	maxDelay: positiveNumberConstant_46,
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
	