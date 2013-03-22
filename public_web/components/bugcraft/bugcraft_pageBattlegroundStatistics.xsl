<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="battlegroundStatistics">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='battlegroundStatistics']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_battlegroundStatisticsPage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_battlegroundStatisticsCloseButton')}"></div>
			
			<div class="battlegroundStatisticsContainer">
				
				<div class="battlegroundsStatisticsHeader">
					<div class="tableHeaderClassIcon"></div>
					<div class="tableHeaderPlayerName">Player Name</div>
					<div class="tableHeader">Killing Blows</div>
					<div class="tableHeader">Deaths</div>
					<div class="tableHeader">Glory Kills</div>
					<div class="tableHeader">Damage Done</div>
					<div class="tableHeader">Healing Done</div>
					<div class="tableHeader">Flag Captures</div>
					<div class="tableHeader">Flag Returns</div>
					<div class="tableHeader">Glory Gained</div>
				</div>
				
				<div class="battlegroundStatisticsItemsContainer" id="{concat(generate-id(), '_battlegroundStatisticsItemsContainer')}">
					<div class="battlegroundListItems" id="{concat(generate-id(), '_battlegroundStatisticsListItems')}">
						
						
						
					</div>
				</div>
				<div class="battlegroundStatisticsControls">
					<div class="battlegroundStatisticsControlUp" id="{concat(generate-id(), '_battlegroundStatisticsListControlUp')}"></div>
					<div class="battlegroundStatisticsControlDown" id="{concat(generate-id(), '_battlegroundStatisticsListControlDown')}"></div>
				</div>
				
			</div>
			
			<div class="battlegroundStatisticsAverages">
				<span class="anteriumPlayers"><span class="playersAmount" id="{concat(generate-id(), '_battlegroundPlayersAnterium')}"></span> Anterium Players</span>
				<span class="hegemonyPlayers"><span class="playersAmount" id="{concat(generate-id(), '_battlegroundPlayersHegemony')}"></span> Hegemony Players</span>
				<span class="battlegroundDuration">Time Elapsed: <span class="playersAmount" id="{concat(generate-id(), '_battlegroundDuration')}"></span></span>
			</div>
			
			<div class="battlegroundOptions">
				
				<div class="battlegroundEnqueue" id="{concat(generate-id(), '_battlegroundStatisticsLeave')}">Leave Battleground</div>
				
			</div>
			
			<div class="windowTitle">Battleground Stats</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>