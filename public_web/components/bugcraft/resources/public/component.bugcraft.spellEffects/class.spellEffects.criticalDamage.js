
	spellEffects.criticalDamage = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 20;
		this.offsetY = - 10;
		this.maximumDistance = - 60;
		this.deleteRange = 50;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;

		var fontFamily = "bold 20px sans-serif";
		
		//draw the floating damge effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.fillStyle = "yellow";
			Map.ctx.font = fontFamily;
			
			Map.ctx.fillText( 
								args.text, 
								args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
								args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
								);
								
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y + self.offsetY;
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the slash effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
		}

		var i = 10;
		var _popup = function()
								{
									fontFamily = "bold " + i + "px sans-serif";
									i+=2;
									self.offsetX +=1
									
									if( i > 26 )
									{
										return;
									}
									
									setTimeout( _popup, 30);
								}
		_popup();
		
		var _animFunction =	function()
											{
												self.offsetY -= 5;
												
												if( self.offsetY < self.maximumDistance )
												{
													self.alpha-=0.05;
												}
												
												if( self.alpha < 0 )
												{
													self.remove();
													
													return;
												}
												
												setTimeout( _animFunction, 30 );
											}
		
		_animFunction();
		
	} //end floating damage