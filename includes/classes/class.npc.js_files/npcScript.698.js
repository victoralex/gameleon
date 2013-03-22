
	
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
														
		var pathConstant_32 = [{"x":527,"y":1118},{"x":630,"y":1083},{"x":697,"y":1097},{"x":790,"y":1233},{"x":755,"y":1377},{"x":662,"y":1237},{"x":524,"y":1194},{"x":525,"y":1162}];
														
		var questIdConstant_37 = 75;
														
		var questParameterNameConstant_38 = "q75_1ForlornStalkersKilled";
														
		var numberConstant_39 = 1;
														
		var timerObjectConstant_43 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_44 = 30000;
														
		var positiveNumberConstant_45 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_32,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_37,
	parameterName: questParameterNameConstant_38,
	value: numberConstant_39,
	
														}
													);
	timerObjectConstant_43.startTimer({
			minDelay: positiveNumberConstant_44,
	maxDelay: positiveNumberConstant_45,
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
	