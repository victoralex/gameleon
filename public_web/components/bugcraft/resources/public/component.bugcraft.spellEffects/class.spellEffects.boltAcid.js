
	spellEffects.boltAcid = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
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
		
		var boltAcidImageObject = new Image();
		boltAcidImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/bolt/acidBolt/bolt_acid_glow0.png';
		
		var boltAcidSound = soundManager.createSound({
				id: 'boltAcid' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/bolt/mud_splat.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( boltAcidSound ) - 1;
		
		soundManager.play( 'boltAcid' + spellEffects.soundIncrementor, 
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
			
			Map.ctx.shadowOffsetX = 9;
			Map.ctx.shadowOffsetY = 9;
			Map.ctx.shadowColor   = 'rgba(0, 0, 0, 0.75)';
			
			Map.ctx.drawImage(
											boltAcidImageObject,
											-self.offsetX,
											-self.offsetY
										);
										
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
				
				args.afterFunction();
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
		
		//remove the dust effect		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateAcidBoltPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var i = 0;
		
		var _animateAcidBolt = function()
											{
												boltAcidImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/bolt/acidBolt/bolt_acid_glow' + ( i++ % 4 ) + '.png';
												
												_animateAcidBoltPointer = setTimeout( _animateAcidBolt, 100 );
											}
		
		var _animateAcidBoltPointer = setTimeout( _animateAcidBolt, 100 );
		
	} //end boltAcid
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	