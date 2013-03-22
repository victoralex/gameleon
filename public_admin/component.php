<?php
	
	error_reporting(E_ALL);
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.cache.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	// Initialize
	SystemConfig::$env = SystemConfig::ENV_SERVICE;
	SystemConfig::$area = SystemConfig::AREA_ADMIN;
	
	SystemConfig::init();
	SystemConfig::setCDN( geoip_country_code_by_name( $_SERVER["REMOTE_ADDR"] ) );	// Set the Content Distribution Network location
	Debug::init();
	
	// Evaluate Params
	if( isset($_GET["component"]) && preg_match("/^[0-9a-zA-Z_]+$/", $_GET["component"]) )
	{
		require_once("../includes/classes/class.componentDefault_" . SystemConfig::$env . ".php");
		
		$file = "components" . DIRECTORY_SEPARATOR . $_GET["component"] . DIRECTORY_SEPARATOR . $_GET["component"] . ".php";
		
		if( file_exists( $file ) )
		{
			require_once( $file );
		}
		else
		{
			// Dummy Class
			class Component extends ComponentDefault
			{
				public function init()
				{
					$this->setHeaderResult( self::ERR_COMPONENT_NOTFOUND );
				}
			}
		}
	}
	else
	{
		require_once("../includes/classes/class.componentDefault_" . SystemConfig::$env . ".php");
		
		// Dummy Class
		class Component extends ComponentDefault
		{
			public function onInit()
			{
				$this->setHeaderResult( self::ERR_COMPONENT_NOTSPECIFIED );
			}
		}
	}
	
	// Initialise Session
	session_start();
	
	// Create output
	$Component = new Component();
	
	if(!$Component->XMLCache->show())
	{
		$Component->XMLCache->start();
		
		if(
			isset($_GET["event"]) &&
			preg_match("/^[0-9a-zA-Z_]+$/", $_GET["event"])
		)
		{
			if( method_exists( &$Component, 'on' . ucfirst($_GET["event"]) ) )
			{
				$Component->{ "on" . ucfirst($_GET["event"]) }();
			}
			else
			{
				$Component->setHeaderResult( Component::ERR_EVENT_NOT_SPECIFIED );
			}
		}
		else if( method_exists( &$Component, 'onInit' ) )
		{
			$Component->onInit();
		}
		else
		{
			$Component->setHeaderResult( Component::ERR_EVENT_NOT_SPECIFIED );
		}
		
		$Component->output();
	}
	
?>