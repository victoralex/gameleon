<?php
	
	abstract class Daemon
	{
		abstract public function start();
		
		public function init()
		{
			Debug::addDaemonRow( array(
										"description" => "Daemon Initializing",
										"dateFormat" => Debug::DATE_FULL
								) );				
		}
		
		public function unload()
		{
			Debug::addDaemonRow( array(
										"description" => "Daemon Finished",
										"dateFormat" => Debug::DATE_FULL
								) );
			
			die();
		}
	}
	
?>