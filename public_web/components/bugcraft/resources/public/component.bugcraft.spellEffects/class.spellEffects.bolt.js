
	spellEffects.bolt = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 22;
		this.offsetY = 15;
		this.duration = 500;
		this.speed = 12;
		this.removeDistance = 35;
		this.rotation = 0;
		this.deleteRange = 310;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX - 153;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY - 113;
		
		var dateStart = new Date();
		var startTime = dateStart.getTime();
		var dateEnd = 0;
		var endTime = 0;
		
		var dx = 0;
		var dy = 0;
		
		var self = this;
		
		var boltImageObject = new Image();
		boltImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/bolt.png';
		
		var lightImageObject = new Image();
		lightImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/light/light_circle_v2_01.png';
		
		var boltSound = soundManager.createSound({
				id: 'bolt' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/bolt.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( boltSound ) - 1;
		
		soundManager.play( 'bolt' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		var boltPositionX = args.sourceCharacter.characterData.character_zone_x;
		var boltPositionY = args.sourceCharacter.characterData.character_zone_y;
		
		//
		//draw the bolt effect
		//
		this.draw = function()
		{
			self.computeTrajectory();
		
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( boltPositionX + Map.viewPortX, boltPositionY + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			
			
			Map.ctx.drawImage(
											lightImageObject,
											- 153,
											- 118
										)
			
			Map.ctx.drawImage(
											boltImageObject,
											- self.offsetX,
											- self.offsetY
										)
										
			self.previousX = boltPositionX - self.offsetX - 153;
			self.previousY = boltPositionY - self.offsetY - 113;

			Map.ctx.restore();
										
			Map.ctx.globalAlpha = 1;

		}
		
		this.computeTrajectory = function()
		{	 
			// remove the effect if the projectile is less than self.removeDistance px to the target
			var distanceToTarget = Math.floor( Math.sqrt( (args.targetCharacter.characterData.character_zone_x - boltPositionX ) * (args.targetCharacter.characterData.character_zone_x - boltPositionX ) + (args.targetCharacter.characterData.character_zone_y - boltPositionY ) * (args.targetCharacter.characterData.character_zone_y - boltPositionY ) ) )
			if ( distanceToTarget < self.removeDistance )
			{
				self.remove();
				
				//var dateEnd = new Date();
				//var endTime = dateEnd.getTime();
				
				//Application.debug.addError( "----------elapsed ms = " + ( endTime - startTime )  );
				
				args.afterFunction();
			}
			
			//Application.debug.addError( "distance to target = " + ( distanceToTarget )  );
			//Application.debug.addError( "----------elapsed ms = " + ( endTime - startTime )  );
			
			dateEnd = new Date();
			endTime = dateEnd.getTime();
			
			self.speed = distanceToTarget *  15 / (self.duration - endTime + startTime);
	
			// angle calculations
			//self.rotation = Math.atan2( ( boltPositionY - args.targetCharacter.characterData.character_zone_y ), ( boltPositionX - args.targetCharacter.characterData.character_zone_x ) ) * 57.2957;
			
			if ( args.targetCharacter.characterData.character_zone_x > boltPositionX )
			{
				self.rotation = Math.atan( (boltPositionY - args.targetCharacter.characterData.character_zone_y) / (boltPositionX - args.targetCharacter.characterData.character_zone_x) );
				//alert('quadran bottom-right + top-right');
			}

			if ( args.targetCharacter.characterData.character_zone_x < boltPositionX && args.targetCharacter.characterData.character_zone_y >= boltPositionY )
			{
				 self.rotation = Math.atan( (boltPositionY - args.targetCharacter.characterData.character_zone_y) / (boltPositionX - args.targetCharacter.characterData.character_zone_x) ) + Math.PI;
				//alert('quadran bottom-left');
			}
			
			if ( args.targetCharacter.characterData.character_zone_x < boltPositionX && args.targetCharacter.characterData.character_zone_y < boltPositionY )
			{
				 self.rotation = Math.atan( (boltPositionY - args.targetCharacter.characterData.character_zone_y) / (boltPositionX - args.targetCharacter.characterData.character_zone_x) ) - Math.PI ;
				//alert('quadran top-left');
			}
																					
			//set step distances
			 dx = Math.floor(this.speed * Math.cos( self.rotation ));
			 dy = Math.floor(this.speed * Math.sin( self.rotation ));
			
			boltPositionX += dx;
			boltPositionY += dy;
			
		}
		
		
		//remove the dust effect
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
	} //end bolt