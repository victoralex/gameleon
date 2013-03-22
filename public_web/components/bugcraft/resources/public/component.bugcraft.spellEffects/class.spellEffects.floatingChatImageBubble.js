
	spellEffects.floatingChatImageBubble = function( args )
	{
		var self = this, _tc = args.targetCharacter;
		
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpelEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 0;
		this.offsetX = 0;
		this.offsetY = 10;
		this.fontSize = args.fontSize ? args.fontSize : 12;
		this.maximumDistance = 60;
		this.deleteRange = 0;
		this.previousX = _tc.characterData.character_zone_x - this.offsetX - 30;
		this.previousY = _tc.characterData.character_zone_y - this.offsetY;
		
		// init images
		var _bubbleCenterImageObject = new Image();
		_bubbleCenterImageObject.src = args.image;
		
		// calculate delete range
		this.deleteRange = 100;
		
		//draw the floating damge effect
		this.draw = function()
		{
			//
			// Draw effect
			//
			
			Map.ctx.save();
			
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.textAlign = "left";
			Map.ctx.fillStyle = args.color ? args.color : "#ffffff";
			Map.ctx.strokeStyle = "#000000";
			Map.ctx.lineWidth = 2;
			
			Map.ctx.drawImage(
								_bubbleCenterImageObject,
								_tc.characterData.character_zone_x + Map.viewPortX - 20,
								_tc.characterData.character_zone_y + Map.viewPortY - 80
							);
			
			Map.ctx.globalAlpha = 1;
			
			Map.ctx.restore();
			
			// delete coordinates
			self.previousX = _tc.characterData.character_zone_x - 85;
			self.previousY = _tc.characterData.character_zone_y - 80;
		}
		
		//remove the effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			
			delete _tc._internal.spellEffects[ this.characterSpelEffectID ];
		}
		
		//
		// Chat bubble animation
		//
		
		var _animFunctionFadeOut = function()
		{
			self.alpha -= 0.05;
			
			if( self.alpha <= 0 )
			{
				self.remove();
				
				return;
			}
			
			setTimeout( _animFunctionFadeOut, 150 );
		}
		
		var _animFunctionFadeIn = function()
		{
			self.alpha += 0.07;
			
			if( self.alpha >= 0.7 )
			{
				// start the fadeout in x seconds
				setTimeout( _animFunctionFadeOut, 2000 );
				
				return;
			}
			
			setTimeout( _animFunctionFadeIn, 50 );
		}
		
		_animFunctionFadeIn();
		
	} //end floatingChatBubble
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	