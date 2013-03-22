
	spellEffects.selectFriendlyAnimation = function( args )
	{
		var self = this, _tc = args.targetCharacter, _tcd = _tc.characterData;
		
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = _tcd.character_width * 0.66;
		this.offsetY = _tcd.character_height * 0.66;
		//this.deleteRange = 80;
		this.previousX = _tcd.character_zone_x - this.offsetX;
		this.previousY = _tcd.character_zone_y - this.offsetY;
		
		var _imageObject = new Image();
		_imageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/selectAnimation/char_selectfriendly_' + _tcd.character_width + 'x' + _tcd.character_height + '.png';
		
		//draw the selectEnemyAnimation
		this.draw = function()
		{
			//Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
								_imageObject,
								_tcd.character_zone_x - self.offsetX + Map.viewPortX,
								_tcd.character_zone_y - self.offsetY + Map.viewPortY
							);
	
			self.previousX = _tcd.character_zone_x - self.offsetX;
			self.previousY = _tcd.character_zone_y - self.offsetY;
	
			//Map.ctx.globalAlpha = 1;
		}
		
		//remove the selectEnemyAnimation
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete _tc._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
	} //end selectFriendlyAnimation