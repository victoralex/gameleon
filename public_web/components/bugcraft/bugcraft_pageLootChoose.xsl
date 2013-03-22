<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<!--
		lootChoose Page Template
	-->
	<xsl:template name="lootChoose">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='lootChoose']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_lootChoosePage')}">
			
			<div class="lootHeader">
				<div class="title">Items</div>
				<div class="closeButton" id="{concat(generate-id(), '_lootChooseCloseButton')}"></div>
			</div>
			
			<div class="lootContainer" id="{concat(generate-id(), '_lootChooseLootContainer')}"></div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>