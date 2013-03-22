
	
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
		
		
		var thisCharacterObjectConstant_37 = npcObject;
														
		var pathConstant_41 = [{"x":1502,"y":503},{"x":1521,"y":445},{"x":1352,"y":475},{"x":1304,"y":528},{"x":1331,"y":584},{"x":1520,"y":622},{"x":1622,"y":588},{"x":1543,"y":543}];
														
		var questIdConstant_47 = 75;
														
		var questParameterNameConstant_48 = "q75_1ForlornStalkersKilled";
														
		var numberConstant_49 = 1;
														
		var timerObjectConstant_53 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_54 = 30000;
														
		var positiveNumberConstant_55 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressive.enable({
														npcObject: thisCharacterObjectConstant_37,
	movePath: pathConstant_41,
	
													});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_47,
	parameterName: questParameterNameConstant_48,
	value: numberConstant_49,
	
														}
													);
	timerObjectConstant_53.startTimer({
			minDelay: positiveNumberConstant_54,
	maxDelay: positiveNumberConstant_55,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_37.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_37
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
	