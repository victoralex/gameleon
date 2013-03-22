
	spellEffects.moveAnimation = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.x - this.offsetX;
		this.previousY = args.y - this.offsetY;
		
		var self = this, _mouseImages = [], _currentMouseImage = 0;
		
		for(var i=0;i<8;i++)
		{
			_mouseImages[ i ] = new Image();
			_mouseImages[ i ].src = "/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/moveAnimation/" + ( i + 1 ) + ".png";
		}
		
		var moveAnimationImageObject = _mouseImages[ _currentMouseImage ];
		
		//draw the moveAnimation
		this.draw = function()
		{
			//Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
								moveAnimationImageObject,
								args.x - self.offsetX + Map.viewPortX,
								args.y - self.offsetY + Map.viewPortY 
							);
	
			self.previousX = args.x - self.offsetX;
			self.previousY = args.y - self.offsetY; 
	
			//Map.ctx.globalAlpha = 1;
		}
		
		//remove the moveAnimation
		this.remove = function()
		{
			clearTimeout( _cycleImagePointer );
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var i = 1;
		
		var _cycleImage = function()
		{
			if( _currentMouseImage >= 7 )
			{
				self.remove();
				
				return;
			}
		
			moveAnimationImageObject = _mouseImages[ ++_currentMouseImage ];
			
			_cycleImagePointer = setTimeout( _cycleImage, 75 );
		}
										
		var _cycleImagePointer = setTimeout( _cycleImage, 75 );
	} //end moveAnimation
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	