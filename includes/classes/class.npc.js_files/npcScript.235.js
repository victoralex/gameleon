
	
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
		
		
		var questIdConstant_24 = 53;
														
		var questParameterNameConstant_25 = "q53_1BeachBugsKilled";
														
		var numberConstant_26 = 1;
														
		var thisCharacterObjectConstant_44 = npcObject;
														
		var pathConstant_45 = [{"x":1554,"y":2508},{"x":1677,"y":2358},{"x":1552,"y":2284},{"x":1372,"y":2321},{"x":1453,"y":2498}];
														
		var timerObjectConstant_46 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_50 = 10000;
														
		var positiveNumberConstant_51 = 11000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressive.enable({
														npcObject: thisCharacterObjectConstant_44,
	movePath: pathConstant_45,
	
													});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_10 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_10,
	questId: questIdConstant_24,
	parameterName: questParameterNameConstant_25,
	value: numberConstant_26,
	
														}
													);
	timerObjectConstant_46.startTimer({
			minDelay: positiveNumberConstant_50,
	maxDelay: positiveNumberConstant_51,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_44.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_44
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
	