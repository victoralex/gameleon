<?php
	
	class SystemConfig
	{
		public static $defaultPage;
		
		public static $defaultLang;
		public static $currentLang;
		
		public static $realmName;
		
		public static $defaultCDN;
		public static $currentCDN;
		
		public static $installDir;
		
		public static $logsDir;
		public static $publicWebDir;
		public static $publicAdminDir;
		
		public static $filesystemUser;
		public static $filesystemGroup;
		public static $filesystemDefaultMode;
		
		public static $mailServers;
		public static $maxMailsPerServer;
		
		public static $daemonsPath;
		public static $daemonsUID;
		public static $daemonsGID;
		
		public static $applicationURL;
		public static $applicationProtocol;
		public static $applicationPort;
		
		public static $env = self::ENV_PAGE;							// Environment ( page | component )
		public static $area = self::AREA_WEB;						// Running Area
		
		public static $publicConfiguration;
		
		const ENV_PAGE = "page";
		const ENV_SERVICE = "service";
		
		const AREA_ADMIN = "admin";
		const AREA_WEB = "web";
		
		public static $versionMajor = 1;
		public static $versionMinor = 0;
		
		public function setCDN( $requestedCDN )
		{
			$rootObject = self::$publicConfiguration->cdn->location;
			
			for($i=count($rootObject)-1;$i>=0;$i--)
			{
				if( $rootObject[$i]["code"] != $requestedCDN )
				{
					continue;
				}
				
				self::$currentCDN = $requestedCDN;
				
				return true;
			}
			
			return false;
		}
		
		function init()
		{
			// Load XML serialized data into public object
			self::$publicConfiguration = simplexml_load_string(
															unserialize(
																file_get_contents( self::$installDir . DIRECTORY_SEPARATOR . "public_" . self::$area . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.serialized" ) 
															)->data
														);
		}
	}
	
?>