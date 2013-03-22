	
	//
	// [NPCName] ( [NPCID] )
	// Level [NPCLevel]
	// Faction [NPCFaction]
	// Assigned to [NPCZoneName] ( [NPCIDZonePool] )
	//
	
	var log = require( "../class.log" );
	
	exports.script = function( npcObject )
	{
		//
		// Variables
		//
		
		
		
		//
		// Events override
		//
		
		
		
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
		npcObject.bindToInstance( npcObject.getArgs().createdByInstanceObject, function() { } );
	}
	