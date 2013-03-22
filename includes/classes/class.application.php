<?php
	
	class Application
	{
		private $xmlLanguage;
		private $component;
		
		public function Application()
		{
			// Initialize session
			session_start();
			
			// Check for page file
			if ( !file_exists( "pages" . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR . $_GET["page"] . ".xml" ) )
			{
				$_GET["page"] = "serverError";
				$_GET["error"] = "404";
			}
			
			// Load page XML
			$this->xmlSource = new DOMDocument();	
			$this->xmlSource->load( "pages" . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR . $_GET["page"] . ".xml" );
			
			// Set output language
			if(
				isset($_GET["lang"]) &&
				preg_match("/^[a-z]{2}\-[A-Z]{2}$/", $_GET["lang"]) &&
				file_exists( "pages" . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $_GET["page"] . "." . $_GET["lang"] . ".xml" )
			)
			{
				SystemConfig::$currentLang = $_GET["lang"];
			}
			
			// Write the language into the output XML
			$this->xmlSource->getElementsByTagName("application")->item(0)->setAttribute("lang", SystemConfig::$currentLang);
			
			// Append $_GET and $_POST values
			XMLManip::createVar( $this->xmlSource, "get", $_GET );
			
			// Check if a component event should be fired
			if(
			   isset($_GET["component"]) &&
			   preg_match("/^[0-9a-zA-Z_]+$/", $_GET["component"]) &&
			   isset($_GET["event"]) &&
			   preg_match("/^[0-9a-zA-Z_]+$/", $_GET["event"])
			)
			{
				$file = "components" . DIRECTORY_SEPARATOR . $_GET["component"] . DIRECTORY_SEPARATOR . $_GET["component"] . ".php";
				
				if( file_exists( $file ) )
				{
					// Classes
					require_once("../includes/classes/class.cache.php");
					require_once("../includes/classes/class.componentDefault_" . SystemConfig::$env . ".php");
					
					require_once( $file );
					
					// Create output
					$this->component = new Component();
					$this->component->componentName = $_GET["component"];
					$this->component->XMLDoc = &$this->xmlSource;
					
					if( method_exists( $this->component, 'on' . ucfirst($_GET["event"]) ) )
					{
						$this->component->{ "on" . ucfirst($_GET["event"]) }();
					}
					else
					{
						$this->component->onInit();
					}
				}
				else
				{
					
				}
			}
			
			// Show computed XML
			switch( SystemConfig::$area )
			{
				case SystemConfig::AREA_ADMIN:
					
					// Always have XML output
					header("Content-Type: text/xml; charset=utf-8");
					
					die( $this->xmlSource->saveXML() );
					
				break;
				case SystemConfig::AREA_WEB:
					
					/*
					// Always have XML output
					header("Content-Type: text/html; charset=utf-8");
					
					$xslt = new XSLTProcessor(); 
					$XSL = new DOMDocument(); 
					$XSL->load( 'pages/' .  $_GET["page"] . '/' .  $_GET["page"] . '.xsl' ); 
					$xslt->importStylesheet( $XSL ); 
					
					die( $xslt->transformToXML( $this->xmlSource ) );
					*/
					
					// Always have XML output
					header("Content-Type: text/xml; charset=utf-8");
					
					die( $this->xmlSource->saveXML() );
					
				break;
			}
			
		}
	}
	
?>