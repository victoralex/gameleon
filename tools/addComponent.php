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
	
	// Initialize
	SystemConfig::init();
	Debug::init();
	ComponentManipulation::init();
	FolderManipulation::init();
	
	if( !isset($argv[1]) || !isset($argv[2]) || !isset($argv[3]) )
	{
		die( "./addComponent.php -c <area_name> <component_name> [-a <page_name>]\n" );
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
				
				echo "Creating component " . $commands[ $switches[$i] ][1] . " in " . $commands[ $switches[$i] ][0] . "\n";
				
				if(
				   	ComponentManipulation::ERR_OK !== ( $retVal = ComponentManipulation::create( array(
											"area" => $commands[ "-c" ][0],
											"name" => $commands[ "-c" ][1],
											"force" => isset($commands["-f"])
										) ) )
				)
				{
					echo "There was a problem creating the new component. ErrorID: " . $retVal . "\n";
				}
				
			break;
			
			// Include into page
			case "-a":
				
				if(in_array( "-c", $switches ))
				{
					echo "Adding component into page " . $commands[ "-a" ][0] . "\n";
					
					if(
						ComponentManipulation::ERR_OK !== ( $retVal = ComponentManipulation::addToPage( array(
												"area" => $commands[ "-c" ][0],
												"component" => $commands[ "-c" ][1],
												"page" => $commands[ "-a" ][0]
											) ) )
					)
					{
						echo "There was a problem adding the component to the page. ErrorID: " . $retVal . "\n";
					}
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