<?php
	
	class Component extends ComponentDefault
	{
		const ERR_NO_DESCRIPTION = 501;
		const ERR_NO_COMPONENT = 502;
		const ERR_INVALID_TYPE = 503;
		const ERR_INVALID_AREA = 504;
		
		const ERR_INVALID_ENVIRONMENT_OS = 510;
		const ERR_INVALID_ENVIRONMENT_VERSION = 511;
		const ERR_INVALID_ENVIRONMENT_BROWSER = 512;
		
		// Component Name
		public $componentName = "serverError";
		
		public function onExternalRequest()
		{
			
		}
		
		public function onAddDebugData()
		{
			if( !isset($_POST["description"]) )
			{
				return $this->setHeaderResult( Component::ERR_NO_DESCRIPTION );
			}
			
			if( !isset($_POST["debugComponent"]) )
			{
				return $this->setHeaderResult( Component::ERR_NO_COMPONENT );
			}
			
			if( !isset($_POST["area"]) || !preg_match("/^(web|admin)$/", $_POST["area"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_AREA );
			}
			
			if( isset($_POST["type"]) && !preg_match("/^(error|warning|info)$/", $_POST["type"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_TYPE );
			}
			
			if( !isset($_POST["environmentOS"]) || empty($_POST["environmentOS"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_ENVIRONMENT_OS );
			}
			
			if( !isset($_POST["environmentVersion"]) || empty($_POST["environmentVersion"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_ENVIRONMENT_VERSION );
			}
			
			if( !isset($_POST["environmentBrowser"]) || empty($_POST["environmentBrowser"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_ENVIRONMENT_BROWSER );
			}
			
			require_once( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . "class.debug.php" );
			
			Debug::addRow( array(
									"description" => $_POST["description"],
									"component" => $_POST["debugComponent"],
									"type" => $_POST["type"],
									"area" => $_POST["area"],
									"environmentBrowser" => $_POST["environmentBrowser"],
									"environmentVersion" => $_POST["environmentVersion"],
									"environmentOS" => $_POST["environmentOS"],
									"source" => Debug::SOURCE_CLIENTCODE
								) );
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );;
		}
	}
	
?>