	
    "use strict"; // enable strict mode within this file
	
	var log = require( "./class.log" ),
		fs = require( "fs" ),
		transaction = require( "./class.transactions" ).transaction,
		realmConfig = require('../config.realm').config,
		character = require('./class.character').character;
	
	//
	// Non Playing Character (NPC) Object
	//
	
	exports.createNPC = function( args, after )
	{
		new character( args, function( characterObject )
		{
			// method overrides
			characterObject.stopMovement = characterObject.stopMovementNPC;
			
			// event overrides
			characterObject.enterCombat = function( after )
			{
				characterObject.inCombat = true;
				
				characterObject.stopAutoHPRegen();
				
				characterObject.events._run( "combatEnter", {} );
				
				after();
			}
			
			characterObject.leaveCombat = function( after )
			{
				characterObject.inCombat = false;
				
				characterObject.startAutoHPRegen();
				
				characterObject.events._run( "combatLeave", {} );
				
				after();
			}
			
			characterObject.sendToClient = function( message )
			{
				//log.add( "NPC " + characterObject.properties.character_id + " has received a request to send message to client " + message );
			}
			
			var _disconnectTransactionPointer = new transaction();
			
			characterObject.command_disconnect = function( after )
			{
				if( characterObject.getInstance() == null )
				{
					after();
					
					return false;
				}
				
				if( !_disconnectTransactionPointer.start( after ) )
				{
					return;
				}
				
				// add this command to the instance history
				
				characterObject.stopAutoHPRegen();
				characterObject.removeFromAllAuras();
				
				characterObject.stopMovement( function()
				{
					characterObject.removeAllOpponents(function()
					{
						// made sure we get out of combat
						
						characterObject.stopAllActiveBuffs(function()
						{
							characterObject.events._run( "disconnect", { byCharacterObject: characterObject } );
							
							characterObject.getInstance().removeNPC( characterObject, function()
							{
								characterObject.addHistory({
																	c: "command_disconnect"
																});
								
								//characterObject.setInstance( null );
								
								_disconnectTransactionPointer.finish();
							});
						});
					});
				});
			}
			
			characterObject.command_disconnect_forced = function( after )
			{
				if( characterObject.getInstance() == null )
				{
					after();
					
					return false;
				}
				
				if( !_disconnectTransactionPointer.start( after ) )
				{
					return;
				}
				
				characterObject.stopAutoHPRegen();
				characterObject.removeFromAllAuras();
				
				characterObject.stopMovement( function()
				{
					characterObject.removeAllOpponents(function()
					{
						// made sure we get out of combat
						
						characterObject.stopAllActiveBuffs(function()
						{
							characterObject.events._run( "disconnect", { byCharacterObject: characterObject } );
							
							characterObject.getInstance().removeNPC( characterObject, function()
							{
								characterObject.addHistory({
																c: "command_disconnect_forced"
															});
								
								//characterObject.setInstance( null );
								
								_disconnectTransactionPointer.finish();
							});
						});
					});
				});
			}
			
			characterObject.bindToInstance = function( instanceObject, afterBindToInstanceFunction )
			{
				if( characterObject.getInstance() == instanceObject )
				{
					afterBindToInstanceFunction();
					
					return false;
				}
				
				// add this character in the instance roster
				instanceObject.addNPC( characterObject );
				
				// save this instance object as a global
				characterObject.setInstance( instanceObject );
				
				// change the character's instance ID
				characterObject.properties.character_id_zone = instanceObject.zone_id;
				
				// make sure we occupy the space the current position, width and height require us to
				//characterObject.updateGridCells();
				
				var _profile = characterObject.getMinimalProfile();
				_profile.c = "add_character";
				
				characterObject.addHistory( _profile );
				
				characterObject.events._run( "bindToInstance", { instanceObject: instanceObject } );
				
				characterObject.getAssociatedQuests( afterBindToInstanceFunction );
				
				return true;
			}
			
			characterObject.modXP = function( xpAmount, after )
			{
				after();
			}
			
			characterObject.modGlory = function( gloryAmount, after )
			{
				after();
			}
			
			characterObject.modPolen = function( polenAmount, after )
			{
				after();
			}
			
			if( characterObject.properties.character_type == 2 )
			{
				// this is an item
				
				characterObject.startAutoHPRegen = function()
				{
					return false;
				}
				
				characterObject.stopAutoHPRegen = function()
				{
					return false;
				}
				
				characterObject.die = function( args )
				{
					// run attached scripts
					characterObject.events._run( "die", { byCharacterObject: args.killerCharacterObject } );
					args.killerCharacterObject.events._run( "killedOpponent", { opponentObject: characterObject } );
				}
				
				characterObject.resurrect = function( args )
				{
					// run attached scripts
					characterObject.events._run( "resurrect", { byCharacterObject: args.resurrectCharacterObject } );
				}
			}
			
			//
			// load the scripts
			//
			
			var _scriptPath = realmConfig.realmInstallPath + "/includes/classes/class.npc.js_files/npcScript." + characterObject.properties.character_id_object_pool;
			
			fs.stat(
					 _scriptPath + ".js",
					function( err, stats )
					{
						if( err )
						{
							if( err.code == "ENOENT" )
							{
								// file not found. Create default structure
								
								characterObject.script = new function()
								{
									log.addNotice( "Default script loaded for object pool ID " + characterObject.properties.character_id_object_pool + ". Object will not be bound to the instance" );
									
									this.postInit = function()
									{
										
									}
								};
								
								after( characterObject );
								
								return;
							}
							
							log.addError( "Error loading NPC script: " + err );
							
							return;
						}
						
						// include the NPC script
						
						log.add( "loading script for NPC: " + characterObject.properties.character_id + " - " + characterObject.properties.character_name + " ( " + characterObject.properties.character_id_object_pool + " ) initialized" );
						
						var _r = require( _scriptPath ).script;
						
						characterObject.script = new _r( characterObject );
						
						log.add( "NPC: " + characterObject.properties.character_id + " - " + characterObject.properties.character_name + " ( " + characterObject.properties.character_id_object_pool + " ) initialized" );
						
						characterObject.events._run( "afterInit", { createdByInstanceObject: characterObject.getArgs().createdByInstanceObject } );
						
						after( characterObject );
					}
				);
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	