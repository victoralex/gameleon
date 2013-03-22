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
	SystemConfig::$area = SystemConfig::AREA_ADMIN;
	
	SystemConfig::init();
	SystemConfig::setCDN( geoip_country_code_by_name( $_SERVER["REMOTE_ADDR"] ) );	// Set the Content Distribution Network location
	Debug::init();
	
	// Check for requested page
	if(!isset($_GET["page"]) || !preg_match("/^[0-9a-zA-Z_]+$/", $_GET["page"]))
	{
		$_GET["page"] = SystemConfig::$defaultPage;
	}
	
	$application = new Application();
?>