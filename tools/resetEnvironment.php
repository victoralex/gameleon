#!/usr/local/bin/php
<?php
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.siteManipulation.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	// Initialize
	SystemConfig::init();
	Debug::init();
	
	Debug::addDaemonRow( array(
								"description" => "Running SiteManipulation::resetLogs",
								"dateFormat" => Debug::DATE_FULL
						) );
	
	SiteManipulation::resetLogs();
	
	Debug::addDaemonRow( array(
								"description" => "Running SiteManipulation::buildSerializedConfig on all areas",
								"dateFormat" => Debug::DATE_FULL
						) );
	
	SiteManipulation::buildSerializedConfig( "public_web" );
	SiteManipulation::buildSerializedConfig( "public_admin" );
	
	Debug::addDaemonRow( array(
								"description" => "Running SiteManipulation::buildJSONConfig on all areas",
								"dateFormat" => Debug::DATE_FULL
						) );
	
	SiteManipulation::buildJSONConfig( "public_web" );
	SiteManipulation::buildJSONConfig( "public_admin" );
	
?>