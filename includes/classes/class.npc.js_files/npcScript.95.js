
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
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
														
		var timerObjectConstant_33 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_34 = 30000;
														
		var positiveNumberConstant_35 = 30000;
														
		var zoneIdConstant_40 = 7;
														
		var objectIdConstant_41 = 887;
														
		var pathConstant_46 = [{"x":2684,"y":837},{"x":2598,"y":938},{"x":2422,"y":1074},{"x":2179,"y":1198},{"x":1891,"y":1269},{"x":1572,"y":1303},{"x":1217,"y":1265},{"x":1000,"y":1244},{"x":750,"y":1184},{"x":612,"y":1097},{"x":509,"y":1028}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "bindToInstance", function( args )
			{
				
								var instanceObject_5 = args.instanceObject;
	timerObjectConstant_33.startTimer({
			minDelay: positiveNumberConstant_34,
	maxDelay: positiveNumberConstant_35,
	onFinalize: function( args )
								{
									thisInstanceObjectConstant_2.addObject(
						{
							zone_id: zoneIdConstant_40,
	object_pool_id: objectIdConstant_41,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_36 = args.characterObject;
	characterObject_36.bindToInstance(
			thisInstanceObjectConstant_2,
			
								function( args )
								{
									
		new npcBehaviors.npcPatrolAggressive.enable({
														npcObject: characterObject_36,
	movePath: pathConstant_46,
	
													});
	
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	
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
	