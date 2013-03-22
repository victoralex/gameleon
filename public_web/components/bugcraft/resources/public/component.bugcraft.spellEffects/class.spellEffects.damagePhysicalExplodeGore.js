
	spellEffects.damagePhysicalExplodeGore = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 20;
		this.offsetY = 50;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 70;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var damagePhysicalExplodeGoreImageObject = new Image();
		damagePhysicalExplodeGoreImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/damage/physical/explode_gore0.png';
		
		//draw the damagePhysicalExplodeGore
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											damagePhysicalExplodeGoreImageObject,
											- self.offsetX,
											- self.offsetY
										);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the damagePhysicalExplodeGore
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var i = 0;
		
		var _animateFunction = function()
												{
													damagePhysicalExplodeGoreImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/damage/physical/explode_gore' + i++ + '.png';
													
													if( i < 2 )
													{
														_animateFunctionPointer = setTimeout( _animateFunction, 90 );
														return;
													}
												
													var _t = setInterval( function()
																					{
																						self.alpha -= 0.1;
																						
																						if( self.alpha > 0 )
																						{
																							return;
																						}
																						
																						self.remove();
																						
																						clearInterval( _t );
																						
																					}, 70 );
																					
												}
												
		var _animateFunctionPointer = setTimeout( _animateFunction, 10 );
							
	} //end waxShell