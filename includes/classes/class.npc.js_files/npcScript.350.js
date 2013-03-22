
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisCharacterObjectConstant_45 = npcObject;
														
		var pathConstant_46 = [{"x":793,"y":1564},{"x":738,"y":1536},{"x":671,"y":1515},{"x":662,"y":1527},{"x":686,"y":1535},{"x":744,"y":1550},{"x":781,"y":1574},{"x":834,"y":1586},{"x":826,"y":1602},{"x":790,"y":1619},{"x":736,"y":1636},{"x":689,"y":1652},{"x":668,"y":1657},{"x":668,"y":1643},{"x":706,"y":1630},{"x":756,"y":1617},{"x":796,"y":1598},{"x":845,"y":1589}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_45,
	movePath: pathConstant_46,
	
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
	