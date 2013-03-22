
	spellEffects.floatingChatTextBubble = function( args )
	{
		var self = this, _tc = args.targetCharacter;
		
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpelEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 0;
		this.offsetX = 0;
		this.offsetY = 10;
		this.fontSize = args.fontSize ? args.fontSize : 16;
		this.maximumDistance = 60;
		this.deleteRange = 0;
		this.previousX = _tc.characterData.character_zone_x - this.offsetX - 70;
		this.previousY = _tc.characterData.character_zone_y - this.offsetY;
		
		var _words = args.text.split( " " ), _lines = [ "" ], _bubbleLineWidth = 150, _bubbleLineHeight = 20, _currentLineWidth = 0, _wordWidth = null,
			_bubbleTopImageObject = new Image(), _bubbleMiddleImageObject = new Image(), _bubbleBottomImageObject = new Image();
		
		// init images
		_bubbleTopImageObject.src = '/appSpecific/img/chat/bubbleTop.png';
		_bubbleMiddleImageObject.src = '/appSpecific/img/chat/bubbleMiddle.png';
		_bubbleBottomImageObject.src = '/appSpecific/img/chat/bubbleBottom.png';
		
		// calculate words' occupied space
		for(var i=0;i<_words.length;i++)
		{
			_wordWidth = Map.ctx.measureText( _words[ i ] + " " ).width;
			
			var _currentWord = _words[ i ];
			while( _wordWidth > _bubbleLineWidth )
			{
				// really long word
				
				_currentWord = _currentWord.substring( 0, _currentWord.length - 1 );
				
				_wordWidth = Map.ctx.measureText( _currentWord ).width;
				
				if( _wordWidth > _bubbleLineWidth )
				{
					continue;
				}
				
				// now it is shorter. add the remaining word to the existing words. it will be evaluated next
				_words.splice( i + 1, 0, _words[ i ].substring( _currentWord.length ) );
				
				// the current word is changed to the new, now shorter, word
				_words[ i ] = _currentWord;
				
				break;
			}
			
			if( _currentLineWidth + _wordWidth <= _bubbleLineWidth )
			{
				_currentLineWidth += _wordWidth;
				
				if( _lines[ _lines.length - 1 ].length > 0 )
				{
					// append space to previous word
					
					_lines[ _lines.length - 1 ] += " ";
				}
				
				_lines[ _lines.length - 1 ] += _words[ i ];
				
				continue;
			}
			
			// new line
			_currentLineWidth = _wordWidth;
			_lines[ _lines.length ] = _words[ i ];
			
			_bubbleLineHeight += 15;
		}
		
		// calculate delete range
		this.deleteRange = _bubbleLineHeight + 130;
		
		var _drawBubble = function( _x, _y )
		{
			Map.ctx.drawImage(
								_bubbleTopImageObject,
								_x,
								_y
							);
			
			for(var i=1;i< ( _bubbleLineHeight / 5 ) + 2;i++)
			{
				Map.ctx.drawImage(
									_bubbleMiddleImageObject,
									_x,
									_y + ( i * 5 )
								);
			}
			
			Map.ctx.drawImage(
								_bubbleBottomImageObject,
								_x,
								_y + Math.floor( ( _bubbleLineHeight / 5 ) + 2 ) * 5
							);
		}
		
		var _drawTextAt = function( text, x, y )
		{
			//Map.ctx.strokeText( text, x, y );
			Map.ctx.fillText( text, x, y );
		}
		
		//draw the floating damge effect
		this.draw = function()
		{
			//
			// Draw effect
			//
			
			Map.ctx.save();
			
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.textAlign = "left";
			Map.ctx.lineWidth = 2;
			Map.ctx.font = self.fontSize + "px helveticaworldBold sans-serif";
			
			_drawBubble(
						_tc.characterData.character_zone_x + Map.viewPortX - 82.5,
						_tc.characterData.character_zone_y + Map.viewPortY - _bubbleLineHeight - 50
					);
			
			for(var i=0;i<_lines.length;i++)
			{
				Map.ctx.fillStyle =  "#1f1f1f";
				
				_drawTextAt(
							_lines[ i ],
							_tc.characterData.character_zone_x + Map.viewPortX - ( Map.ctx.measureText( _lines[ i ] ).width / 2 ),
							_tc.characterData.character_zone_y + Map.viewPortY - ( -15 * i ) - _bubbleLineHeight - 40
						);
				
				Map.ctx.fillStyle = args.color ? args.color : "#efefef";
				
				_drawTextAt(
							_lines[ i ],
							_tc.characterData.character_zone_x + Map.viewPortX - ( Map.ctx.measureText( _lines[ i ] ).width / 2 ) - 1,
							_tc.characterData.character_zone_y + Map.viewPortY - ( -15 * i ) - _bubbleLineHeight - 40 - 1
						);
			}
			
			Map.ctx.globalAlpha = 1;
			
			Map.ctx.restore();
			
			// delete coordinates
			self.previousX = _tc.characterData.character_zone_x - 85;
			self.previousY = _tc.characterData.character_zone_y - _bubbleLineHeight - 50;
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
				setTimeout( _animFunctionFadeOut, 6000 );
				
				return;
			}
			
			setTimeout( _animFunctionFadeIn, 50 );
		}
		
		_animFunctionFadeIn();
		
	} //end floatingChatBubble
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	