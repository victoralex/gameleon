
	spellEffects.honeyBuff = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		
		var honeyBuffImageObject = new Image();
		honeyBuffImageObject.src = 'images/buffs/honeyBuff/honey_buff0.png';
		
		var honeyBuffSound = soundManager.createSound({
				id: 'honeyBuff' + ( ++soundIncrementor ),
				url: 'sounds/dirt2.mp3', 
				volume: args.volume
		});
		//honeyBuffSound.play();
		
		//draw the honeyBuff
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
			
			spellEffects.ctx.save();
			
			spellEffects.ctx.translate( args.x, args.y );
			
			spellEffects.ctx.rotate( args.rotation );
			
			spellEffects.ctx.drawImage(
							honeyBuffImageObject,
							- 30,
							- 30
						);
						
			spellEffects.ctx.restore();
						
			spellEffects.ctx.globalAlpha = 1;
		}
		
		//remove the honeyBuff
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
		}
							
		var _animateHoneyBuff =	setTimeout ( function()
															{
																args.rotation += Math.PI / 64;
																
																honeyBuffImageObject.src = 'images/buffs/honeyBuff/honey_buff' + Math.floor( Math.random() * 4 ) + '.png';
															}, 20 );			
		_animateHoneyBuff();
		
		setTimeout( function() 
								{ 
									clearTimeout( _animateHoneyBuff );
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
	} //end honeyBuff