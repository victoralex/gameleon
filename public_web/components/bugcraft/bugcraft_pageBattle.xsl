<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<!--
		Battle template
	-->
	
	<xsl:template name="battle">
		<xsl:param name="globalID" select="generate-id()" />
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='battle']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="loaderPageConnect" id="{concat($globalID, '_battlePageLoader')}">
			<div class="elementsContainer">
				<div class="loaderText">loading...</div>
				<div class="loaderBar"><div class="progressBar" id="{concat($globalID, '_battlePageLoaderProgressBar')}"></div></div>
				<div class="quote" id="{concat($globalID, '_battlePageLoaderQuote')}"></div>
			</div>
		</div>
		
		<div class="battlePage" id="{concat($globalID, '_battlePage')}">
			
			<!-- HTML Map -->
			
			<div class="map" id="{concat($globalID, '_mapContainer')}">
				<div class="drag" id="{concat($globalID, '_mapDragContainer')}"></div>
			</div>
			
			<!-- Effects canvas -->
			
			<canvas class="canvas" id="{concat($globalID, '_canvasArea')}" width="758" height="900"></canvas>
			
			<div class="messagesContainer" id="{concat($globalID, '_messagesContainer')}"></div>
			
			<div class="hidden" id="{concat($globalID, '_barCastTimeContainer')}">
				<div class="numbers" id="{concat($globalID, '_barCastTimeNumbers')}"></div>
				<div class="filling" id="{concat($globalID, '_barCastTimeFilling')}"></div>
				<div class="ending" id="{concat($globalID, '_barCastTimeEnding')}"></div>
			</div>
			
			<!-- Quests -->
			<!--
			<div class="questTest" id="{concat($globalID, '_questTest')}">
				<input type="button" value="Kill" id="{concat($globalID, '_qtKillButton')}"/>
				<input type="button" value="Kill Squirrel" id="{concat($globalID, '_qtKillSquirrelButton')}"/>
				<div class="questProgressContainer" id="{concat($globalID, '_qtQuestProgressContainer')}">
				</div>
			</div>
			-->
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>