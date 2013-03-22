	
	spellEffects.moveCharacter = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
	
		var character = new Image();
		character.src =  'images/_characters/character' + Math.floor( Math.random() * 6 )  + '.png';
		
		//calculate the angle to orient the character image towards destination
		var xRelative = args.x - args.xOrigin;
		var yRelative = args.y - args.yOrigin;
		
		var distance = Math.sqrt( (xRelative * xRelative) + (yRelative * yRelative) ) - 30;
		
		var _theta = Math.atan2( yRelative, xRelative );
																				
		//set step distances
		dx = Math.floor(5 * Math.cos( _theta ));
		dy = Math.floor(5 * Math.sin( _theta ));
	
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
		
			spellEffects.ctx.drawImage(
											character, 
											args.xOrigin, 
											args.yOrigin
										);
										
			spellEffects.ctx.globalAlpha = 1;
		}
		
		//remove the starAura
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
		}
		
		
		
		move = function()
							{
								args.xOrigin += dx;
								args.yOrigin += dy;
								
								setTimeout( move, 20 );
								
								return { x: args.xOrigin, y: args.yOrigin };
							}
		
		move();
		
		if( args.xOrigin == args.x )
		{ 													
			self.remove();
		}

	} //end moveCharacter