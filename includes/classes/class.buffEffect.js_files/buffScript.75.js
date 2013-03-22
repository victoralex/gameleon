	
	//
	// Strike
	//
	
	var log = require( "../class.log" );
	
	exports.script = function( buffObject )
	{
		buffObject._checkHit = function()
		{
			var _sp = buffObject.getSource().properties, _cp = buffObject.getCharacter().properties;
			
			if(
				_sp.character_main_hand_damage_max == null && _sp.character_off_hand_damage_max == null
			)
			{
				// can't strike a friendly source or i don't have a weapon
				
				return false;
			}
			
			// we have at least one weapon equiped
			
			var personalRoll = 0;
			
			if( _sp.character_main_hand_damage_max != null && _sp.character_off_hand_damage_max == null )
			{
				// single wield main hand
				
				personalRoll = ( ( 75 - ( _cp.character_level - _sp.character_level ) * 1.7 ) / 100 ) +
										( 25 * ( _sp.character_attack / ( _sp.character_level * 4 ) ) ) / 100;
			}
			else if( _sp.character_main_hand_damage_max == null && _sp.character_off_hand_damage_max != null )
			{
				// single wield off hand
				
				personalRoll = ( ( 75 - ( _cp.character_level - _sp.character_level ) * 1.7 ) / 100 ) +
										( 25 * ( _sp.character_attack / ( _sp.character_level * 4 ) ) ) / 100;
			}
			else
			{
				// dual wield
				
				personalRoll = ( ( 66 - ( _cp.character_level - _sp.character_level ) * 1.7 ) / 100 ) +
										( 25 * ( _sp.character_attack / ( _sp.character_level * 4 ) ) ) / 100;
			}
			
			// roll a percentile
			if( Math.random() <= personalRoll )
			{
				return true;
			}
			
			return false;
		}
		
		buffObject._checkCrit = function( _sourceData, _targetData )
		{
			var _critCalculation = ( ( ( 5 + ( _sourceData.character_level - _targetData.character_level ) ) - ( _targetData.character_defense * 0.05 ) / 100 ) + ( 25 * _sourceData.character_attack / _sourceData.character_level * 5 ) ) / 100;
			
			// roll a percentile
			if( Math.random() <= _critCalculation )
			{
				return true;
			}
			
			return false;
		}
		
		this.specific = function()
		{
			var _s = buffObject.getSource(), _c = buffObject.getCharacter(), _hpDiff = _s.getStrikeValue( _c, buffObject.multiplier );
			
			// run the events
			_s.events._run( "damageGive", { toCharacterObject: _c, amount: _hpDiff } );
			_c.events._run( "damageTake", { fromCharacterObject: _s, amount: _hpDiff } );
			
			//log.add( "Calculated damage: " + _hpDiff );
			
			_c.modHP({
					amount: -_hpDiff,
					sourceCharacterObject: _s,
					sourceBuff: buffObject,
					after: function()
					{
						
					}
				});
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	