#!/usr/local/bin/php
<?php
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.folderManipulation.php");
	require_once("../includes/classes/class.pageManipulation.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	// Initialize
	SystemConfig::init();
	Debug::init();
	PageManipulation::init();
	FolderManipulation::init();
	
	if( !isset($argv[1]) || !isset($argv[2]) || !isset($argv[3]) )
	{
		die( "./addPage.php -c <area_name> <page_name> [-d <page_name>] [-f]\n" );
	}
	
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
				
				echo "Creating page " . $commands[ $switches[$i] ][1] . " in " . $commands[ $switches[$i] ][0] . "\n";
				
				if(
				   	PageManipulation::ERR_OK !== ( $retVal = PageManipulation::create( array(
										"area" => $commands[ "-c" ][0],
										"name" => $commands[ "-c" ][1],
										"force" => isset($commands["-f"]),
										"defaultPage" => isset($commands["-d"]) ? $commands["-d"][0] : ''
									) ) )
				)
				{
					echo "There was a problem creating the new page. ErrorID: " . $retVal . "\n";
				}
				
			break;
			
			// Default page
			case "-d":
				
				
				
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