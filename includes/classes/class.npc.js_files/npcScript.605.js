
	
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
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var pathConstant_32 = [{"x":486,"y":276},{"x":649,"y":305},{"x":825,"y":303},{"x":938,"y":294},{"x":1098,"y":375},{"x":1205,"y":528},{"x":1295,"y":686},{"x":1290,"y":760},{"x":1232,"y":848},{"x":1084,"y":858},{"x":944,"y":785},{"x":794,"y":792},{"x":738,"y":849},{"x":808,"y":981},{"x":877,"y":1066},{"x":790,"y":1203},{"x":499,"y":1151},{"x":456,"y":1102},{"x":343,"y":919},{"x":325,"y":760},{"x":344,"y":699},{"x":394,"y":584},{"x":455,"y":491},{"x":377,"y":380},{"x":389,"y":307},{"x":423,"y":287}];
														
		
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
	