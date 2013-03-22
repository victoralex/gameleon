
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var pathConstant_17 = [{"x":1157,"y":2793},{"x":1053,"y":2779},{"x":993,"y":2764},{"x":1021,"y":2668},{"x":1200,"y":2693},{"x":1262,"y":2734},{"x":1301,"y":2782},{"x":1321,"y":2833},{"x":1223,"y":2868},{"x":1116,"y":2861},{"x":1067,"y":2832}];
														
		var questIdConstant_22 = 53;
														
		var questParameterNameConstant_23 = "q53_1BeachBugsKilled";
														
		var numberConstant_24 = 1;
														
		var thisCharacterObjectConstant_27 = npcObject;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_27,
	movePath: pathConstant_17,
	
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
	