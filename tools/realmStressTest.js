	
	var syncSQL = new (require( "../includes/classes/class.syncSQL" )).p;
	
	var _createCharacter = function( npcIndex )
	{
		syncSQL.q(
				"CALL character_add( 8, 'npc" + npcIndex + "', 'ant', 'scout' )",
				function( res )
				{
					console.log( npcIndex + " " + res[0].character_id );
					
					syncSQL.q(
							"call character_mark_active( " + res[0].character_id + " )",
							function( res2 )
							{
								console.log( npcIndex + " active" );
							}
						);
				}
			);
	}
	
	syncSQL.q(
			"delete from `characters` where `character_id` > 228",
			function( res )
			{
				// previous characters deleted
				
				var j=0;
				for(var i=0;i<2000;i++)
				{
					_createCharacter( ++j );
				}
			}
		);