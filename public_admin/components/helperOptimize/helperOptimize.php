<?php
	
	class Component extends ComponentDefault
	{
		// Component Name
		public $componentName = "helperOptimize";
		
		public function onInit()
		{
			require_once( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . "class.optimize.php" );
			
			Optimize::CSS( "public_web" );
			Optimize::CSS( "public_admin" );
			Optimize::JS( "public_web" );
			Optimize::JS( "public_admin" );
			
			$this->setHeaderResult( self::ERR_OK_NOCACHE );
			
			return true;
		}
	}
	
?>