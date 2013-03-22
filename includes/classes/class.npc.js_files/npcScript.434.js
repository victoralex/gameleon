
	
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
														
		var pathConstant_32 = [{"x":802,"y":488},{"x":779,"y":701},{"x":724,"y":854},{"x":494,"y":872},{"x":191,"y":839},{"x":94,"y":702},{"x":85,"y":545},{"x":150,"y":434},{"x":223,"y":221},{"x":357,"y":126},{"x":432,"y":117},{"x":585,"y":99},{"x":709,"y":120},{"x":783,"y":181},{"x":823,"y":399},{"x":709,"y":524},{"x":783,"y":725},{"x":1038,"y":819},{"x":1355,"y":899},{"x":1472,"y":703},{"x":1501,"y":559},{"x":1479,"y":364},{"x":1438,"y":250},{"x":1310,"y":63},{"x":1258,"y":46},{"x":1128,"y":55},{"x":942,"y":156},{"x":882,"y":264},{"x":862,"y":373}];
														
		
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
	