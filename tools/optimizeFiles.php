#!/usr/local/bin/php
<?php
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.folderManipulation.php");
	require_once("../includes/classes/class.componentManipulation.php");
	require_once("../includes/classes/class.optimize.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	// Initialize
	SystemConfig::init();
	Debug::init();
	ComponentManipulation::init();
	FolderManipulation::init();
	Optimize::init();
	
	// Functions
	
	// Functional part
	
	$lastCommand = "_default_";
	$commands = array( $lastCommand => array() );
	
	$argvLength = count($argv);
	for($i=1;$i<$argvLength;$i++)
	{
		if(substr($argv[$i], 0, 1) != '-')
		{
			$commands[ $lastCommand ][] = $argv[$i];
			
			continue;
		}
		
		$commands[ $argv[$i] ] = array();
		$lastCommand = $argv[$i];
	}
	
	// Parse commands
	
	$switches = array_keys( $commands );
	$switchesLength = count( $switches );
	
	for($i=0;$i<$switchesLength;$i++)
	{
		switch($switches[$i])
		{
			// CSS
			case "-css":
				
				Optimize::CSS("public_web");
				Optimize::CSS("public_admin");
				
			break;
			
			// No good option specified
			default:
				
				Optimize::CSS("public_web");
				Optimize::CSS("public_admin");
				
		}
	}
?>