
	
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
														
		var thisCharacterObjectConstant_32 = npcObject;
														
		var pathConstant_33 = [{"x":1281,"y":1640},{"x":1373,"y":1671},{"x":1539,"y":1662},{"x":1609,"y":1651},{"x":1724,"y":1706},{"x":1661,"y":1792},{"x":1499,"y":1952},{"x":1122,"y":2077},{"x":1062,"y":2111},{"x":1060,"y":2069},{"x":1268,"y":1932},{"x":1241,"y":1655}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_32,
	movePath: pathConstant_33,
	
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
	