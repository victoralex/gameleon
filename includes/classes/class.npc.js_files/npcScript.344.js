
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		// Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var pathConstant_37 = [{"x":1292,"y":242},{"x":1189,"y":252},{"x":1172,"y":241},{"x":1146,"y":234},{"x":1022,"y":366},{"x":1019,"y":396},{"x":979,"y":391},{"x":952,"y":395},{"x":924,"y":404},{"x":905,"y":426},{"x":789,"y":160},{"x":753,"y":165},{"x":714,"y":171},{"x":684,"y":182},{"x":669,"y":212},{"x":522,"y":406},{"x":478,"y":387},{"x":426,"y":403},{"x":504,"y":232},{"x":1158,"y":323},{"x":1168,"y":432},{"x":1281,"y":309},{"x":1296,"y":263}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_37,
	
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
	