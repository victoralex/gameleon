<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="talentTree">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='talentTree']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_talentTreePage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_talentTreeCloseButton')}"></div>
			
			<div class="treeArea">
				<div class="treeLeft" id="{concat(generate-id(), '_talentTreeLeftTree')}">
					<div class="treeTitle" id="{concat(generate-id(), '_talentTreeLeftTreeTitle')}"></div>
					<div class="treeBuffs" id="{concat(generate-id(), '_talentTreeLeftTreeBuffs')}">
						
						<div class="treeBuff1" id="{concat(generate-id(), '_talentTreeLeftBuff1')}"></div>
						<div class="treeBuff2" id="{concat(generate-id(), '_talentTreeLeftBuff2')}"></div>
						<div class="treeBuff3" id="{concat(generate-id(), '_talentTreeLeftBuff3')}"></div>
						<div class="treeBuff4" id="{concat(generate-id(), '_talentTreeLeftBuff4')}"></div>
						<div class="treeBuff5" id="{concat(generate-id(), '_talentTreeLeftBuff5')}"></div>
						<div class="treeBuff6" id="{concat(generate-id(), '_talentTreeLeftBuff6')}"></div>
						<div class="treeBuff7" id="{concat(generate-id(), '_talentTreeLeftBuff7')}"></div>
						<div class="treeBuff8" id="{concat(generate-id(), '_talentTreeLeftBuff8')}"></div>
						<div class="treeBuff9" id="{concat(generate-id(), '_talentTreeLeftBuff9')}"></div>
						
					</div>
				</div>
				<div class="treeRight" id="{concat(generate-id(), '_talentTreeRightTree')}">
					<div class="treeTitle" id="{concat(generate-id(), '_talentTreeRightTreeTitle')}"></div>
					<div class="treeBuffs" id="{concat(generate-id(), '_talentTreeRightTreeBuffs')}">
						
						<div class="treeBuff1" id="{concat(generate-id(), '_talentTreeRightBuff1')}"></div>
						<div class="treeBuff2" id="{concat(generate-id(), '_talentTreeRightBuff2')}"></div>
						<div class="treeBuff3" id="{concat(generate-id(), '_talentTreeRightBuff3')}"></div>
						<div class="treeBuff4" id="{concat(generate-id(), '_talentTreeRightBuff4')}"></div>
						<div class="treeBuff5" id="{concat(generate-id(), '_talentTreeRightBuff5')}"></div>
						<div class="treeBuff6" id="{concat(generate-id(), '_talentTreeRightBuff6')}"></div>
						<div class="treeBuff7" id="{concat(generate-id(), '_talentTreeRightBuff7')}"></div>
						<div class="treeBuff8" id="{concat(generate-id(), '_talentTreeRightBuff8')}"></div>
						<div class="treeBuff9" id="{concat(generate-id(), '_talentTreeRightBuff9')}"></div>
						
					</div>
				</div>
			</div>
			
			<div class="talentTreeStats">Spent Talent Points: <span class="talentPoints" id="{concat(generate-id(), '_talentTreePointsSpent')}"></span> Available Talent Points: <span class="talentPoints" id="{concat(generate-id(), '_talentTreePointsAvailable')}"></span></div>
			
			<div class="windowTitle">Talent Tree</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>