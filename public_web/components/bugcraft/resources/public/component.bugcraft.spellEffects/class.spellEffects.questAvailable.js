
	spellEffects.questAvailable = function( args )
	{
		var self = this, questImageObject = new Image(), _tc = args.targetCharacter, _tcd = _tc.characterData;
		
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.alpha = 0;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		
		questImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/quests/questAvailable.png';
		
		//draw the low health effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							questImageObject,
							_tcd.character_zone_x - self.offsetX + Map.viewPortX + 15,
							_tcd.character_zone_y - self.offsetY + Map.viewPortY - _tcd.character_height / 2 + 10
						);
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the hitVenomSting
		this.remove = function()
		{
			spellEffects.layerCleaner.push( self );
			spellEffects.layer[1][ self.ID ] = null;
			
			delete _tc._internal.spellEffects[ self.characterSpellEffectID ];
		}
		
		var _fadeFunction = function( _inc, _final, _gt )
		{
			self.alpha = Math.round( ( self.alpha += _inc ) * 100 ) / 100;
			
			if( ( _gt ? self.alpha > _final : self.alpha < _final ) )
			{
				setTimeout( function()
				{
					_fadeFunction( _inc, _final, _gt );
				}, 100 );
				
				return;
			}
			
			// reached the target
			setTimeout( function()
			{
				_fadeFunction( -_inc, ( _final == 1 ) ? 0.5 : 1, ( _final == 1 ) );
			}, 100 );
		}
		
		_fadeFunction( 0.04, 1, false );
	}