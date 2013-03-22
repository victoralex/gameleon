<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:template match="component:appJS" mode="header">
		
		<xsl:variable name="selectedCDN" select="//application/@cdn" />
		
		<script type="text/javascript"><![CDATA[
			
			/*
				Make sure the app initializes on DOMContentLoaded event
			*/
			
			function DOMContentLoaded()
			{
				if(arguments.callee.done)
				{
					return;
				}
				
				arguments.callee.done = true;
				
				// Initialize Application
				Application.init();
			}
			
			if (document.addEventListener)
			{
				document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
			}
			
			(
			 	function()
				{
					/*@cc_on
					if (document.body)
					{
						try {
							document.createElement('div').doScroll('left');
							return DOMContentLoaded();
						} catch(e) {}
					}
					/*@if (false) @*/
						if (/loaded|complete/.test(document.readyState)) return DOMContentLoaded();
					/*@end @*/
					
					if (!DOMContentLoaded.done) setTimeout(arguments.callee, 50);
				}
			)();
			
			_prevOnload = window.onload;
			window.onload = function()
										{
											if (typeof _prevOnload === 'function') _prevOnload();
											
											DOMContentLoaded();
										};
			
		]]></script>
		<script type="text/javascript" src="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/js/compiled_head.js')}"></script>
		
	</xsl:template>
	
	<xsl:template match="component:appJS" mode="footer">
		
		<xsl:variable name="selectedCDN" select="//application/@cdn" />
		<xsl:variable name="translationRoot" select="$translation/component[@name='appJS']/scenario[@for='incompatibleBrowser']" />
		
		<!-- Incompatible browser notice -->
		<div class="ascentBrowserIncompatibleScreenHidden" id="ascentBrowserIncompatibleScreen">
			<div class="backgroundContainer">
				<div class="centerContainer">
					<div class="incompatibleMessage"><xsl:copy-of select="$translationRoot/field[@name='message']/node()" /></div>
					<div class="compatibleBrowsers">
						<a class="firefox" href="http://www.getfirefox.com" target="_blank" title="{$translationRoot/field[@name='getFirefox']/text()}"></a>
						<a class="chrome" href="http://chrome.google.com" target="_blank" title="{$translationRoot/field[@name='getChrome']/text()}"></a>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Include Compiled JS -->
		<script type="text/javascript" src="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/js/compiled_body.js')}"></script>
		
	</xsl:template>
	
</xsl:stylesheet>