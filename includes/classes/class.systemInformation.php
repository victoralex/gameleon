<?php
	
	class SystemInformation
	{
		public function init()
		{
		
		}
		
		public function getBrowser($agent=null)
		{
			// Declare known browsers to look for
			$known = array(
				'msie', 'firefox', 'safari', 'webkit', 'opera', 'netscape', 'konqueror', 'gecko'
			);
			
			// Clean up agent and build regex that matches phrases for known browsers
			// (e.g. "Firefox/2.0" or "MSIE 6.0" (This only matches the major and minor
			// version numbers.  E.g. "2.0.0.6" is parsed as simply "2.0"
			$agent = strtolower($agent ? $agent : $_SERVER['HTTP_USER_AGENT']);
			$pattern = '#(?<browser>' . join('|', $known) . ')[/ ]+(?<version>[0-9]+(?:\.[0-9]+)?)#';

			// Find all phrases (or return empty array if none found)
			if(
				!preg_match_all($pattern, $agent, $matches)
			) 
			{
				return array();
			}
			
			// Since some UAs have more than one phrase (e.g Firefox has a Gecko phrase,
			// Opera 7,8 have a MSIE phrase), use the last one found (the right-most one
			// in the UA).  That's usually the most correct.
			$i = count($matches['browser']) - 1;
			
			return array($matches['browser'][$i] => $matches['version'][$i]);
		}
	}
	
?>