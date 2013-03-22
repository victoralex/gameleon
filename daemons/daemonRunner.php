#!/usr/local/bin/php
<?php
	
	declare( ticks = 1 );
	
	error_reporting( E_ALL );
	set_time_limit( 0 );
	ob_implicit_flush();
	
	// Classes
	require_once("../includes/classes/class.debug.php");
	require_once("../includes/classes/class.databaseConfig.php");
	require_once("../includes/classes/class.systemConfig.php");
	require_once("../includes/classes/class.daemon.php");
	
	// Vital Files
	require_once("../includes/config.inc.php");
	
	if( !isset($argv[1]) )
	{
		Debug::addDaemonRow( array(
									"description" => "Syntax ./daemonRunner.php <daemonClassName> [arg1] [arg2] ...",
									"dateFormat" => Debug::DATE_FULL,
									"type" => Debug::TYPE_ERROR
							) );
		
		die();
	}
	
	$daemonClassPath = SystemConfig::$daemonsPath . DIRECTORY_SEPARATOR . "daemon." . $argv[1] . ".php";
	
	if( !file_exists( $daemonClassPath ) )
	{
		Debug::addDaemonRow( array(
									"description" => "Daemon class file " . $daemonClassPath . " not found",
									"dateFormat" => Debug::DATE_FULL,
									"type" => Debug::TYPE_ERROR
							) );
		
		die();
	}
	
	// Include the class file
	require_once( $daemonClassPath );
	
	$className = ucfirst( $argv[1] . "Daemon" );
	
	if( !class_exists( $className ) )
	{
		Debug::addDaemonRow( array(
									"description" => "Class Name " . $className . " not found",
									"dateFormat" => Debug::DATE_FULL,
									"type" => Debug::TYPE_ERROR
							) );
		
		die();
	}
	
	/*
	// Become a daemon by forking and closing the parent
	
	$processID = pcntl_fork(); 
	
	if($processID == -1) 
	{ 
		Debug::addDaemonRow( array(
									"description" => "Failed to fork on starting daemon " . $className,
									"dateFormat" => Debug::DATE_FULL,
									"type" => Debug::TYPE_ERROR
							) );
		
		die();
	}
	
	if ($processID) 
	{ 
		// Parent process. Exiting
		
		exit(); 
	}
	
	// This is the child process.
	posix_setsid();
	umask(0);
	
	if( !posix_setgid( SystemConfig::$daemonsGID ) ) 
	{
		Debug::addDaemonRow( array(
									"description" => "Failed to set GID " . SystemConfig::$daemonsGID . " for " . $className,
									"dateFormat" => Debug::DATE_FULL,
									"type" => Debug::TYPE_ERROR
							) );
		
		exit();
	}

	if( !posix_setuid( SystemConfig::$daemonsUID ) ) 
	{
		Debug::addDaemonRow( array(
									"description" => "Failed to set UID " . SystemConfig::$daemonsGID . " for " . $className,
									"dateFormat" => Debug::DATE_FULL,
									"type" => Debug::TYPE_ERROR
							) );
		
		exit();
	}
	*/
	
	$daemonObject = new $className;
	
	pcntl_signal(SIGTERM, array($daemonObject, 'unload'));  
	pcntl_signal(SIGINT, array($daemonObject, 'unload'));
	
	$daemonObject->init();
	$daemonObject->start();
	$daemonObject->unload();
	
?>