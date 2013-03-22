<?php
	
	class DatabaseConfig
	{
		public static $hostname;
		public static $username;
		public static $password;
		public static $database;
		
		function connect()
		{
			@ $mysqli = new mysqli(self::$hostname, self::$username, self::$password, self::$database);
			
			if(mysqli_connect_errno())
			{
				Debug::addRow( array(
							"type" => Debug::TYPE_ERROR,
							"component" => "Class DatabaseConfig",
							"source" => Debug::SOURCE_SQL,
							"title" => "Connect Attempt",
							"description" => mysqli_connect_errno() . " " . mysqli_connect_error(),
							"file" => __FILE__, "line" => __LINE__ 
						) );
				
				die( "Unable to connect to the database. Reported error was: " . mysqli_connect_error() );
			}
			
			return $mysqli;
		}
		
		function pconnect()
		{
			@ $mysqli = new mysqli( "p:" . self::$hostname, self::$username, self::$password, self::$database);
			
			if(mysqli_connect_errno())
			{
				Debug::addRow( array(
							"type" => Debug::TYPE_ERROR,
							"component" => "Class DatabaseConfig",
							"source" => Debug::SOURCE_SQL,
							"title" => "Connect Attempt",
							"description" => mysqli_connect_errno() . " " . mysqli_connect_error(),
							"file" => __FILE__, "line" => __LINE__ 
						) );
				
				die( "Unable to connect to the database. Reported error was: " . mysqli_connect_error() );
			}
			
			return $mysqli;
		}
	}
	
?>