#!/usr/local/bin/php
<?php
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.siteManipulation.php");
	require_once("../includes/classes/class.folderManipulation.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	/*
		Main code
	*/
	
	if(
		!isset($argv[1]) || !isset($argv[2])
	)
	{
		die( "./replicateFramework.php <source_path> <target_path>" . "\n" );
	}
	
	if( !file_exists( $argv[1] ) )
	{
		die( "Source site not found: " . $argv[1] );
	}
	
	if( !file_exists( $argv[2] ) )
	{
		die( "Target site not found: " . $argv[2] );
	}
	
	$globalStep = 0;
	
	$_replicate = 	function( $args )
							{
								global $argv, $globalStep;
								
								Debug::addDaemonRow( array(
															"description" => "Step " . ( ++$globalStep ) . ": " . $args["description"],
															"dateFormat" => Debug::DATE_FULL
													) );
								
								FolderManipulation::copy( array(
																"source" => $argv[1] . DIRECTORY_SEPARATOR . $args["fileName"],
																"destination" => $argv[2] . DIRECTORY_SEPARATOR . $args["fileName"]
															) );
							};
	
	$_replicate( array(
				"fileName" => "daemons",
				"description" => "Global Daemons"
			) );
	
	$_replicate( array(
				"fileName" => "includes" . DIRECTORY_SEPARATOR . "classes",
				"description" => "Global Classes"
			) );
	
	$_replicate( array(
				"fileName" => "includes" . DIRECTORY_SEPARATOR . "facebookApi",
				"description" => "Global Facebook API"
			) );
	
	$_replicate( array(
				"fileName" => "tools",
				"description" => "Global Tools"
			) );
	
	$_replicate( array(
				"fileName" => "public_admin" . DIRECTORY_SEPARATOR . "components",
				"description" => "Public Admin Components"
			) );
	
	$_replicate( array(
				"fileName" => "public_admin" . DIRECTORY_SEPARATOR . "libraries",
				"description" => "Public Admin Libraries"
			) );
	
	$_replicate( array(
				"fileName" => "public_admin" . DIRECTORY_SEPARATOR . "widgets",
				"description" => "Public Admin Libraries"
			) );
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
?>