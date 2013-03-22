<?php
	
	class Component extends ComponentDefault
	{
		const ERR_NO_PAGE = 501;
		const ERR_UPDATE_ERROR = 401;
		
		// Component Name
		public $componentName = "helperInclude";
		
		public function onUpdateComponentsToPage()
		{
			if( !isset($_GET["page"]) || !preg_match("/^[0-9a-zA-Z_]+$/", $_GET["page"]) )
			{
				return $this->setHeaderResult( self::ERR_NO_PAGE );
			}
			
			require_once( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . "class.componentManipulation.php" );
			
			ComponentManipulation::init();
			
			// Load page XML
			$xmlSource = new DOMDocument();	
			$xmlSource->load( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "public_" . SystemConfig::$area . DIRECTORY_SEPARATOR . "pages" . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR . $_GET["page"] . ".xml" );
			
			foreach(
				$xmlSource->getElementsByTagNameNS('http://component.emotionconcept.ro', '*') as $element
			)
			{
				if(
					ComponentManipulation::ERR_OK !== ( $retVal = ComponentManipulation::addToPage( array(
										"area" => "public_" . SystemConfig::$area,
										"page" => $_GET["page"],
										"component" => $element->localName,
										"overwriteTranslations" => true
									) ) )
				)
				{
					return $this->setHeaderResult( self::ERR_UPDATE_ERROR );
				}
			}
			
			// $this->outputType = ComponentDefault::OUTPUT_JSON;
			
			$this->setHeaderResult( self::ERR_OK_NOCACHE );
			
			return true;
		}
	}
	
?>