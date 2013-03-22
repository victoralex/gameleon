<?php
	
	error_reporting(E_ALL);
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.xmlManipulation.php");
	require_once("../includes/classes/class.application.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	// Initialize
	SystemConfig::$env = SystemConfig::ENV_PAGE;
	SystemConfig::$area = SystemConfig::AREA_WEB;
	
	SystemConfig::init();
	@ SystemConfig::setCDN( geoip_country_code_by_name( $_SERVER["REMOTE_ADDR"] ) );	// Set the Content Distribution Network location
	Debug::init();
	
	// Make sure the site is accessed according to the configuration
	if(
		$_SERVER["SERVER_NAME"] != SystemConfig::$applicationURL &&
		$_SERVER["REQUEST_METHOD"] == "GET"
	)
	{
		header( "location: " . SystemConfig::$applicationProtocol . "://" . SystemConfig::$applicationURL . $_SERVER["REQUEST_URI"] );
		die();
	}
	
	// Check for requested page
	if(!isset($_GET["page"]) || !preg_match("/^[0-9a-zA-Z_]+$/", $_GET["page"]))
	{
		$_GET["page"] = SystemConfig::$defaultPage;
	}
	
	/*
		Start the application
	*/
	
	// Initialize session
	session_start();
	
	// Check for page file
	if ( !file_exists( "pages" . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR . $_GET["page"] . ".xml" ) )
	{
		// No page structure found
		
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		
		$_GET["page"] = "serverError";
	}
	
	// Load page XML
	$xmlSource = new DOMDocument();	
	$xmlSource->load( "pages" . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR . $_GET["page"] . ".xml" );
	
	// Set output language
	if(
		isset($_GET["lang"]) &&
		ereg("^[a-z]{2}\-[A-Z]{2}$", $_GET["lang"]) &&
		file_exists( "pages" . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $_GET["page"] . "." . $_GET["lang"] . ".xml" )
	)
	{
		SystemConfig::$currentLang = $_GET["lang"];
	}
	
	// Write the language & CDN into the output XML
	$applicationRootElement = $xmlSource->getElementsByTagName("application")->item(0);
	$applicationRootElement->setAttribute("lang", SystemConfig::$currentLang);
	$applicationRootElement->setAttribute("cdn", SystemConfig::$currentCDN);
	
	// Append $_GET and $_POST values
	XMLManip::createVar( $xmlSource, "get", $_GET );
	
	ob_start();
	
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
			$componentObject = new Component();
			$componentObject->XMLDoc = $xmlSource;
			
			if( method_exists( $componentObject, 'on' . ucfirst($_GET["event"]) ) )
			{
				$componentObject->{ "on" . ucfirst($_GET["event"]) }();
			}
			else if( method_exists( $componentObject, 'onInit' ) )
			{
				$componentObject->onInit();
			}
		}
		else
		{
			// Server error on no server processing file found
			
			header("Cache-Control: no-cache, must-revalidate");
			header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
			header("Location: /serverError/serverError/externalRequest/code500");
			
			die();
		}
	}
	
	/*
		Check if there is any output. Should it be, it must be an error
	*/
	
	$buffer = ob_get_contents();
	
	if( !empty( $buffer ) )
	{
		// Debug data may be sent
		header("Content-Type: text/html; charset=utf-8");
		
		die( $buffer );
	}
	
	/*
		Output is ok, displaying by request
	*/
	
	if( !isset($componentObject) )
	{
		/*
		// Always have XML output
		header("Content-Type: text/xml; charset=utf-8");
		
		die( $xmlSource->saveXML() );
		*/
		
		// Always have HTML output
		$xslt = new XSLTProcessor(); 
		$XSL = new DOMDocument(); 
		$XSL->load( 'pages' . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR .  $_GET["page"] . '.xsl' ); 
		$xslt->importStylesheet( $XSL );
		
		die( $xslt->transformToXML( $xmlSource ) );
	}
	
	/*
		A component is requested
	*/
	
	switch( $componentObject->outputType )
	{
		case ComponentDefault::OUTPUT_XML:
			
			// Always have XML output
			header("Content-Type: text/xml; charset=utf-8");
			
			die( $xmlSource->saveXML() );
			
		break;
		case ComponentDefault::OUTPUT_JSON:
			
			header("Content-Type: application/json; charset=utf-8");
			
			die( json_encode( new SimpleXMLElement(
													$xmlSource->saveXML(),
													LIBXML_NOCDATA
												) ) );
			
		break;
		case ComponentDefault::OUTPUT_HTML:
			
			header("Content-Type: text/html; charset=utf-8");
			
			$xslt = new XSLTProcessor(); 
			$XSL = new DOMDocument(); 
			$XSL->load( 'pages' . DIRECTORY_SEPARATOR . $_GET["page"] . DIRECTORY_SEPARATOR .  $_GET["page"] . '.xsl' ); 
			$xslt->importStylesheet( $XSL ); 
			
			die( $xslt->transformToXML( $xmlSource ) );
			
		break;
		default:
			
			header("Content-Type: text/plain; charset=utf-8");
			
			ob_end_flush();
	}
?>