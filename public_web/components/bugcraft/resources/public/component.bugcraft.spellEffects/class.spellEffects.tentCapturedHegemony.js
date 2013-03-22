	
	spellEffects.tentCapturedHegemony = function( args )
	{
		var _c = args.targetCharacter, _cd = _c.characterData;
		
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = _c._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 70; //half the width of the image 
		this.offsetY = 70; //half the height of the image
		this.deleteRange = 140; // greatest of the height or widht of the image
		this.previousX = _cd.character_zone_x - this.offsetX - 100; // both previousX/Y used to erase the image from the canvas
		this.previousY = _cd.character_zone_y - this.offsetY - 100;
		
		var self = this, _glowImage = new Image(), _rotation = 0;
		
		_glowImage.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/towerCapturedHegemony/storeroom_hegemony.png';
		
		//draw the anteriumFlag
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( _cd.character_zone_x + Map.viewPortX, _cd.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( ( _rotation += 0.001 ) * Math.PI * 2 );
			
			Map.ctx.drawImage(
									_glowImage,
									- self.offsetX,
									- self.offsetY
								);
			
			self.previousX = _cd.character_zone_x - self.offsetX - 50;
			self.previousY = _cd.character_zone_y - self.offsetY - 50;
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the anteriumFlag
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete _c._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	