
	
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
		
		
		var thisCharacterObjectConstant_42 = npcObject;
														
		var pathConstant_43 = [{"x":828,"y":407},{"x":948,"y":412},{"x":974,"y":358},{"x":980,"y":287},{"x":844,"y":266},{"x":759,"y":205},{"x":763,"y":118},{"x":833,"y":147},{"x":773,"y":167},{"x":760,"y":265},{"x":712,"y":312},{"x":663,"y":327},{"x":637,"y":374},{"x":601,"y":418},{"x":509,"y":424},{"x":422,"y":362},{"x":398,"y":223},{"x":447,"y":140},{"x":555,"y":115},{"x":635,"y":174},{"x":690,"y":241},{"x":758,"y":301},{"x":887,"y":308},{"x":955,"y":312},{"x":974,"y":393},{"x":826,"y":433}];
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_42,
	movePath: pathConstant_43,
	
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
	