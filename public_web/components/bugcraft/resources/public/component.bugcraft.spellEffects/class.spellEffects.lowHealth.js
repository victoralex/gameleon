
	spellEffects.lowHealth = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		
		var lowHealthImageObject = new Image();
		lowHealthImageObject.src = 'images/red_flash2.png';
		
		
		//draw the low health effect
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
			spellEffects.ctx.drawImage(
							lowHealthImageObject,
							args.x - 30,
							args.y - 30
						);
			spellEffects.ctx.globalAlpha = 1;
		}
		
		//remove the low health effect
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
		}
		
		var variation = 0;
		var _t =	setInterval( function()
												{
													self.alpha = Math.abs( Math.sin( variation ) );

													variation += Math.PI / 32;
													
													if (self.alpha < 0.5 )
													{
														self.alpha = 0.5;
													}
													
													
												}, 100 )									
		
		setTimeout( function() 
								{ 
									
									clearInterval( _t );
								
									var _timeout = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _timeout );
																			
																		}, 200 );
								}, args.duration );
		
	} //end low health