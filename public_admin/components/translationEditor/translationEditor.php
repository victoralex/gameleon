<?
	
	class Component extends ComponentDefault
	{
		// Data transfer errors
		const ERR_INVALID_LANGUAGE = 501;
		const ERR_INVALID_AREA = 502;
		const ERR_COMPONENT_NAME = 503;
		
		// Server errors
		const ERR_NONEXISTENT_AREA = 601;
		const ERR_NONEXISTENT_COMPONENT = 602;
		const ERR_NO_CONTENT = 603;
		const ERR_INVALID_CONTENT = 604;
		
		public function onShowComponents()
		{
			if( !isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if( !isset($_GET["area"]) || !ereg("^[a-z_]+$", $_GET["area"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_AREA );
			}
			
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] ) )
			{
				return $this->setHeaderResult( Component::ERR_NONEXISTENT_AREA );
			}
			
			// Functional part
			
			$baseDir = SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] . DIRECTORY_SEPARATOR . "components";
			$componentsNames = array();
			
			$dirPointer = dir(  $baseDir );
			while (false !== ($entry = $dirPointer->read()))
			{
				if( $entry == "." || $entry == ".." )
				{
					continue;
				}
				
				$componentXMLObject = $this->XMLDoc->createElement("areaComponent");
				$componentXMLObject->setAttribute("name", $entry );
				$componentXMLObject->setAttribute("editDate", filemtime( $baseDir . DIRECTORY_SEPARATOR . $entry ) );
				
				$this->content->appendChild( $componentXMLObject );
			}
			$dirPointer->close();
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onShowOne()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_GET["componentName"]) || !ereg("^[a-zA-Z0-9_]+$", $_GET["componentName"]))
			{
				return $this->setHeaderResult( Component::ERR_COMPONENT_NAME );
			}
			
			if( !isset($_GET["area"]) || !ereg("^[a-z_]+$", $_GET["area"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_AREA );
			}
			
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] ) )
			{
				return $this->setHeaderResult( Component::ERR_NONEXISTENT_AREA );
			}
			
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $_GET["componentName"] ) )
			{
				return $this->setHeaderResult( Component::ERR_NONEXISTENT_COMPONENT );
			}
			
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $_GET["componentName"] . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $_GET["language"] . ".xml" ) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			$this->content->appendChild(
					$this->XMLDoc->createCDATASection( 
										file_get_contents( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $_GET["componentName"] . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $_GET["language"] . ".xml" )
								)
				);
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onEdit()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_GET["componentName"]) || !ereg("^[a-zA-Z0-9_]+$", $_GET["componentName"]))
			{
				return $this->setHeaderResult( Component::ERR_COMPONENT_NAME );
			}
			
			if( !isset($_GET["area"]) || !ereg("^[a-z_]+$", $_GET["area"]) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_AREA );
			}
			
			if( !isset($_POST["content"]) || strlen($_POST["content"]) == 0 )
			{
				return $this->setHeaderResult( Component::ERR_NO_CONTENT );
			}
			
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] ) )
			{
				return $this->setHeaderResult( Component::ERR_NONEXISTENT_AREA );
			}
			
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $_GET["componentName"] ) )
			{
				return $this->setHeaderResult( Component::ERR_NONEXISTENT_COMPONENT );
			}
			
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $_GET["componentName"] . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $_GET["language"] . ".xml" ) )
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			$this->setCDATAValue( array(
									"field" => "componentTranslationText",
									"value" => $_POST["content"]
								) );
			
			// Check the data
			
			libxml_use_internal_errors( true );
			
			$doc = new DOMDocument('1.0', 'utf-8');
			$doc->loadXML( $_POST["content"] );
			
			$errors = libxml_get_errors();
			
			if( !empty($errors) )
			{
				$error = $errors[ 0 ];
				
				if( $error->level >= 3 )
				{
					$lines = explode("\r", $_POST["content"]);
					$line = $lines[ $error->line - 1 ];
					
					$this->setCDATAValue( array(
												"field" => "errorMessage",
												"value" => $error->message
											) );
					
					$this->setValue( array(
											"field" => "errorLine",
											"value" => $error->line
										) );
					
					$this->setCDATAValue( array(
											"field" => "errorCode",
											"value" => htmlentities($line)
										) );
					
					return $this->setHeaderResult( Component::ERR_INVALID_CONTENT );
				}
			}
			
			$doc->save(
					SystemConfig::$installDir . DIRECTORY_SEPARATOR . $_GET["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $_GET["componentName"] . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $_GET["language"] . ".xml"
				);
			
			require_once( SystemConfiguration::$installPath . DIRECTORY_SEPARATOR . "includes/classes/class.componentManipulation.php");
			
			ComponentManipulation::updateAll( array(
										"area" => $_GET["area"],
										"component" => $_GET["componentName"],
									) );
			
			// Page Redirections
			if( SystemConfig::$env == SystemConfig::ENV_PAGE && isset($_POST["continueEdit"]) && $_POST["continueEdit"] == "0")
			{
				header( "location: index.php?page=" . $_GET["page"] . "&language=" . $_GET["language"]);
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onInit()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK );
		}
	}
	
?>