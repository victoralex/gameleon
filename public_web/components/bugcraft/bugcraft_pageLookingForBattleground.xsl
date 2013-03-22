<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="lookingForBattleground">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='lookingForBattleground']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_lookingForBattlegroundPage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_battlegroundsCloseButton')}"></div>
			
			<div class="battlegroundsListContainer">
				
				<div class="battlegroundsListItemsContainer" id="{concat(generate-id(), '_battlegroundsListItemsContainer')}">
					<div class="battlegroundListItems" id="{concat(generate-id(), '_battlegroundsListItems')}"></div>
				</div>
				<div class="battlegroundsListControls">
					<div class="battlegroundsListControlUp" id="{concat(generate-id(), '_battlegroundsListControlUp')}"></div>
					<div class="battlegroundsListControlDown" id="{concat(generate-id(), '_battlegroundsListControlDown')}"></div>
				</div>
				
			</div>
			<div class="battlegroundInformation">
				
				<div class="battlegroundData">
					<div class="battlegroundName" id="{concat(generate-id(), '_battlegroundName')}">Battleground Name</div>
					<div class="battlegroundDescription" id="{concat(generate-id(), '_battlegroundDescription')}">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
				</div>
				
				<div class="battlegroundSpoils">
					<div class="battlegroundWin">
						<div class="spoilTitle">Win</div>
						<div class="spoilDetail">
							<div class="spoilGlory" id="{concat(generate-id(), '_battlegroundSpoilWinGlory')}" title="Glory"></div>
							<div class="spoilPolen" id="{concat(generate-id(), '_battlegroundSpoilWinPolen')}" title="Polen"></div>
						</div>
					</div>
					<div class="battlegroundLoss">
						<div class="spoilTitle">Loss</div>
						<div class="spoilDetail">
							<div class="spoilGlory" id="{concat(generate-id(), '_battlegroundSpoilLossGlory')}" title="Glory"></div>
							<div class="spoilPolen" id="{concat(generate-id(), '_battlegroundSpoilLossPolen')}" title="Polen"></div>
						</div>
					</div>
				</div>
				
			</div>
			
			<div class="battlegroundOptions">
				
				<div class="battlegroundEnqueue" id="{concat(generate-id(), '_battlegroundEnqueue')}">Enroll in Queue</div>
				
			</div>
			
			<div class="windowTitle">Battlegrounds</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>