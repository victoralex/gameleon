	
	//
	// Ravage
	//
	
	var log = require( "../class.log" );
	
	exports.script = function( buffObject )
	{
		this.specific = function()
		{
			// get amount of crack shell stacks on target
			var _tc = buffObject.getCharacter(),
					_sc = buffObject.getSource(),
					_stacks = _tc.getActiveBuffAmount( 11 ),
					_hpDiff = ( _sc.getStrikeValue( _tc, buffObject.multiplier ) / 3 ) * _stacks;
			
			_tc.modHP({
						amount: _hpDiff,
						sourceCharacterObject: _sc,
						after: function()
						{
							log.add( "Buff 87 special damage: " + _hpDiff );
						}
					});
		}
	}