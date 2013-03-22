#!/usr/local/bin/php
<?php
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.folderManipulation.php");
	require_once("../includes/classes/class.componentManipulation.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	if( !isset($argv[1]) || !isset($argv[2]) || !isset($argv[3]) )
	{
		die( "./includeComponent.php [-c <area_name> <page_name> <component_name>] [-u <area_name> <component_name>] [-overwriteTranslations]\n" );
	}
	
	// Initialize
	SystemConfig::init();
	Debug::init();
	ComponentManipulation::init();
	FolderManipulation::init();
	
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
			// Create
			case "-c":
				
				echo "Adding component " . $commands[ $switches[$i] ][2] . " to page " . $commands[ $switches[$i] ][1] . " in area " . $commands[ $switches[$i] ][0] . "\n";
				
				if(
				   	ComponentManipulation::ERR_OK !== ( $retVal = ComponentManipulation::addToPage( array(
										"area" => $commands[ "-c" ][0],
										"page" => $commands[ "-c" ][1],
										"component" => $commands[ "-c" ][2],
										"overwriteTranslations" => isset($commands["-overwriteTranslations"]) ? true : false
									) ) )
				)
				{
					echo "There was a problem adding the component. ErrorID: " . $retVal . "\n";
				}
				
			break;
			
			// Update all
			case "-u":
				
				echo "Updating all pages containing " . $commands[ "-u" ][1] . " in area " . $commands[ "-u" ][0] . "\n";
				
				if(
				   	ComponentManipulation::ERR_OK !== ( $retVal = ComponentManipulation::updateAll( array(
										"area" => $commands[ "-u" ][0],
										"component" => $commands[ "-u" ][1],
										"overwriteTranslations" => isset($commands["-overwriteTranslations"]) ? true : false
									) ) )
				)
				{
					echo "There was a problem updating the pages where this component is included. ErrorID: " . $retVal . "\n";
				}
				
			break;
			
			// Remove
			case "-r":
				
				
				
			break;
			
			// Force
			case "-f":
				
				
				
			break;
			
			// No good option specified
			default:
				
		}
	}
?>