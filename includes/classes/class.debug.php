<?php
	
	class Debug
	{
		const TYPE_ERROR = "error";
		const TYPE_WARNING = "warning";
		const TYPE_INFO = "info";
		
		const DATE_FULL = "d-m-Y H:i.s";
		const DATE_HOUR = "H:i.s";
		
		const SOURCE_CLIENTCODE = "clientCode";
		const SOURCE_SERVERCODE = "serverCode";
		const SOURCE_SQL = "SQL";
		
		const AREA_WEB = "web";
		const AREA_ADMIN = "admin";
		
		const DEBUG_TITLE_UNSPECIFIED = "No Title";
		const DEBUG_DESCRIPTION_UNSPECIFIED = "No Description";
		
		const ENVIRONMENT_OS_UNSPECIFIED = "none";
		const ENVIRONMENT_VERSION_UNSPECIFIED = "none";
		const ENVIRONMENT_BROWSER_UNSPECIFIED = "none";
		
		private static $filePrefix;
		private static $componentName = "blankComponent";
		
		public function init()
		{
			self::$filePrefix = SystemConfig::$logsDir . DIRECTORY_SEPARATOR . "ascent" . DIRECTORY_SEPARATOR . "debug";
		}
		
		public function addDaemonRow( $args )
		{
			if(
				!is_array($args) ||
				!isset($args["description"])
			)
			{
				return false;
			}
			
			$args["type"] = isset($args["type"]) ? $args["type"] : self::TYPE_INFO;
			$args["dateFormat"] = isset($args["dateFormat"]) ? $args["dateFormat"] : self::DATE_HOUR;
			
			echo date( $args["dateFormat"] ) . " " . strtoupper($args["type"]) . ": " . $args["description"] . "\n";
			
			return true;
		}
		
		public function addRow( $args )
		{
			if( !is_array($args) )
			{
				return false;
			}
			
			$args["type"] = isset($args["type"]) ? $args["type"] : self::TYPE_INFO;
			$args["component"] = isset($args["component"]) ? $args["component"] : self::$componentName;
			$args["source"] = isset($args["source"]) ? $args["source"] : self::SOURCE_SERVERCODE;
			$args["file"] = isset($args["file"]) ? $args["file"] : __FILE__;
			$args["line"] = isset($args["line"]) ? $args["line"] : __LINE__;
			$args["dateFormat"] = isset($args["dateFormat"]) ? $args["dateFormat"] : self::DATE_FULL;
			$args["area"] = isset($args["area"]) ? $args["area"] : self::AREA_WEB;
			
			$args["title"] = isset($args["title"]) ? $args["title"] : self::DEBUG_TITLE_UNSPECIFIED;
			$args["description"] = isset($args["description"]) ? $args["description"] : self::DEBUG_DESCRIPTION_UNSPECIFIED;
			
			$args["environmentOS"] = isset($args["environmentOS"]) ? $args["environmentOS"] : self::ENVIRONMENT_OS_UNSPECIFIED;
			$args["environmentVersion"] = isset($args["environmentVersion"]) ? $args["environmentVersion"] : self::ENVIRONMENT_VERSION_UNSPECIFIED;
			$args["environmentBrowser"] = isset($args["environmentBrowser"]) ? $args["environmentBrowser"] : self::ENVIRONMENT_BROWSER_UNSPECIFIED;
			
			file_put_contents(
					self::$filePrefix . "_" . $args["type"] . ".log",
					"<entry date='" . date( $args["dateFormat"] ) . "' component='" . $args["component"] . "' source='" . $args["source"] . "' area='" . $args["area"] . "' file='" . $args["file"] . "' line='" . $args["line"] . "'>" .
						"<title><![CDATA[" . $args["title"] . "]]></title>" .
						"<description><![CDATA[" . $args["description"] . "]]></description>" .
						"<environment><os><![CDATA[" . $args["environmentOS"] . "]]></os><version><![CDATA[" . $args["environmentVersion"] . "]]></version><browser><![CDATA[" . $args["environmentBrowser"] . "]]></browser></environment>" .
					"</entry>",
					FILE_APPEND
				);
			
			return true;
		}
	}
	
?>