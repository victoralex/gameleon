<?php
	
	class Character
	{
		public $character_name = "";
		public $character_level = 1;
		public $character_hp_current = 0;
		public $character_hp_max = 0;
		public $character_race = "ladybug";
		public $character_class = "warrior";
		public $character_rotation = 0;
		public $character_speed = 0;
		
		public $x = 100;
		public $y = 100;
		
		public $__buffs = array();
		
		public $__last_update = 0;
		public $__disconnected = false;
		
		public function __construct( $updatePoint =  0 )
		{
			$this->__last_update = $updatePoint;
		}
	}
	
	class CharacterBuff
	{
		public $buffID;
		public $characterBuffID;
		public $name;
		public $type;
		
		public function __construct( $characterBuffID, $buffID )
		{
			$this->buffID = $buffID;
			$this->characterBuffID = $characterBuffID;
		}
	}
	
?>