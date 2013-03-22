<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="questGiver">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='questGiver']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_questGiverPage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_questGiverCloseButton')}"></div>
			
			<div class="questsListContainer">
				
				<div class="questsListItemsContainer" id="{concat(generate-id(), '_questsListItemsContainer')}">
					<div class="questListItems" id="{concat(generate-id(), '_questsListItems')}"></div>
				</div>
				<div class="questsListControls">
					<div class="questsListControlUp" id="{concat(generate-id(), '_questGiverQuestsListControlUp')}"></div>
					<div class="questsListControlDown" id="{concat(generate-id(), '_questGiverQuestsListControlDown')}"></div>
				</div>
				
			</div>
			<div class="questInformation">
				
				<div class="questData" id="{concat(generate-id(), '_questGiverQuestsDataContainer')}">
					<div class="Scroller-Container">
						<div class="questName" id="{concat(generate-id(), '_questGiverQuestName')}"></div>
						<div class="questDescription" id="{concat(generate-id(), '_questGiverQuestDescription')}"></div>
						
						<div class="questObjectivesTitle">Quest Objectives</div>
						<div class="questObjectives" id="{concat(generate-id(), '_questGiverQuestObjectives')}"></div>
					</div>
				</div>
				
				<div class="questsListControls" id="{concat(generate-id(), '_questGiverQuestsDataControlsContainer')}">
					<div class="Scrollbar-Up"></div>
					<div class="Scrollbar-Track">
						<div class="Scrollbar-Handle"></div>
					</div>
					<div class="Scrollbar-Down"></div>
				</div>
				
				<div class="questSpoils">
					<div class="questResources">
						<div class="spoilTitle">Resources</div>
						<div class="spoilDetail">
							<div class="spoilPolen" id="{concat(generate-id(), '_questSpoilPolen')}" title="Polen"></div>
							<div class="spoilAmber" id="{concat(generate-id(), '_questSpoilAmber')}" title="Amber"></div>
						</div>
					</div>
					<div class="questCharacter">
						<div class="spoilTitle">Character</div>
						<div class="spoilDetail">
							<div class="spoilXP" id="{concat(generate-id(), '_questSpoilXP')}" title="XP"></div>
							<div class="spoilGlory" id="{concat(generate-id(), '_questSpoilGlory')}" title="Glory"></div>
						</div>
					</div>
				</div>
				
			</div>
			
			<div class="questOptions">
				
				<div class="hidden" id="{concat(generate-id(), '_questGiverAcceptButton')}">Accept</div>
				<div class="hidden" id="{concat(generate-id(), '_questGiverDeclineButton')}">Decline</div>
				<div class="hidden" id="{concat(generate-id(), '_questGiverFinalizeButton')}">Complete Quest</div>
				
			</div>
			
			<div class="windowTitle" id="{concat(generate-id(), '_questGiverName')}"></div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>