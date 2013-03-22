	
	spellEffects.characters = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
	
		var bee = new Image();
		bee.src =  'images/_characters/character' + Math.floor( Math.random() * 6 )  + '.png';
	
	
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
			
			spellEffects.ctx.save();
			
			spellEffects.ctx.translate( args.x, args.y );
			
			spellEffects.ctx.rotate( args.rotation );
		
			spellEffects.ctx.drawImage(
											bee, 
											- 30, 
											- 35
										);
										
			spellEffects.ctx.restore();
										
			spellEffects.ctx.globalAlpha = 1;
		}
		
		//remove the starAura
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
		}
		
		setTimeout( function() 
								{ 
									var _t = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _t );
																			
																		}, 100 );
								}, args.duration );

	} //end characters