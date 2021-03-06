
	spellEffects.boltStickySprayNonCascade = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 42;
		this.offsetY = 12;
		this.duration = 500;
		this.speed = 12;
		this.removeDistance = 60;
		this.rotation = 0;
		this.deleteRange = 102;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX - 5;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY - 30;
		
		var dateStart = new Date();
		var startTime = dateStart.getTime();
		var dateEnd = 0;
		var endTime = 0;
		
		var dx = 0;
		var dy = 0;
		
		var self = this;
		
		var boltStickySprayImageObject = new Image();
		boltStickySprayImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/bolt/stickySprayBolt/bolt_slow_glow0.png';
		
		var boltStickySpraySound = soundManager.createSound({
				id: 'boltStickySpray' + ( ++soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/boltStickySpray.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		//boltStickySpraySound.play();

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
			
			Map.ctx.translate( boltPositionX, boltPositionY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.shadowOffsetX = 9;
			Map.ctx.shadowOffsetY = 9;
			Map.ctx.shadowColor   = 'rgba(0, 0, 0, 0.75)';
			
			Map.ctx.drawImage(
											boltStickySprayImageObject,
											- self.offsetX,
											- self.offsetY
										)

			self.previousX = boltPositionX - self.offsetX - 5;
			self.previousY = boltPositionY - self.offsetY - 30;
										
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
			}
			
			dateEnd = new Date();
			endTime = dateEnd.getTime();
			
			self.speed = distanceToTarget *  15 / (self.duration - endTime + startTime);
			
			// angle calculations
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
		
		
		//remove the boltStickySpray effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearInterval( _cycleImagePointer );
		}

		var i = 0;
		
		var _cycleImage = function()
										{
											boltStickySprayImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/bolt/stickySprayBolt/bolt_slow_glow' + ( i++ % 4 ) + '.png';
											
											_cycleImagePointer = setTimeout( _cycleImage, 100 );
										}
		
		var _cycleImagePointer = setTimeout( _cycleImage, 100 );
		
	} //end boltStickySpray