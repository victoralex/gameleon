<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="questLog">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='questLog']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<!-- Quest tracking -->
		<div class="hidden" id="{concat(generate-id(), '_questLogProgressContainer')}">
			
			<div class="questLogProgressTitle">Objectives</div>
			
			<div class="questsContainer" id="{concat(generate-id(), '_questLogProgressQuestsContainer')}"></div>
			
		</div>
		
		<!-- Main window -->
		<div class="hidden" id="{concat(generate-id(), '_questLogPage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_questLogCloseButton')}"></div>
			
			<div class="questLogListContainer">
				
				<div class="questLogListItemsContainer" id="{concat(generate-id(), '_questLogQuestsListItemsContainer')}">
					<div class="questListItems" id="{concat(generate-id(), '_questLogListItems')}"></div>
				</div>
				<div class="questLogListControls">
					<div class="questLogListControlUp" id="{concat(generate-id(), '_questLogQuestsListControlUp')}"></div>
					<div class="questLogListControlDown" id="{concat(generate-id(), '_questLogQuestsListControlDown')}"></div>
				</div>
				
			</div>
			
			<div id="{concat(generate-id(), '_questLogQuestDetails')}">
				
				<div class="questInformation">
					
					<div class="questData" id="{concat(generate-id(), '_questLogQuestsDataContainer')}">
						<div class="Scroller-Container">
							<div class="questName" id="{concat(generate-id(), '_questLogQuestName')}"></div>
							<div class="questDescription" id="{concat(generate-id(), '_questLogQuestDescription')}"></div>
							
							<div class="questObjectivesTitle">Quest Objectives</div>
							<div class="questObjectives" id="{concat(generate-id(), '_questLogQuestObjectives')}"></div>
							
							<div class="questConditions" id="{concat(generate-id(), '_questLogQuestConditions')}"></div>
						</div>
					</div>
					
					<div class="questsListControls" id="{concat(generate-id(), '_questLogQuestsDataControlsContainer')}">
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
								<div class="spoilPolen" id="{concat(generate-id(), '_questLogSpoilPolen')}" title="Polen"></div>
								<div class="spoilAmber" id="{concat(generate-id(), '_questLogSpoilAmber')}" title="Amber"></div>
							</div>
						</div>
						<div class="questCharacter">
							<div class="spoilTitle">Character</div>
							<div class="spoilDetail">
								<div class="spoilXP" id="{concat(generate-id(), '_questLogSpoilXP')}" title="XP"></div>
								<div class="spoilGlory" id="{concat(generate-id(), '_questLogSpoilGlory')}" title="Glory"></div>
							</div>
						</div>
					</div>
					
				</div>
				
				<div class="questOptions">
					
					<div class="questAbandon" id="{concat(generate-id(), '_questLogAbandonButton')}">Abandon quest</div>
					
				</div>
			
			</div>
			
			<div class="hidden" id="{concat(generate-id(), '_questLogNoQuestsContainer')}">You have no active quests</div>
			
			<div class="windowTitle">Quest Log</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>