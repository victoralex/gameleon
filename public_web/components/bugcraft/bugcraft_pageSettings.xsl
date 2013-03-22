<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="settings">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='settings']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_settingsPage')}">
			
			<div class="windowTitle"><xsl:value-of select="$translationRoot/field[@name='windowTitle']/text()" /></div>
			
			<div class="button" id="{concat(generate-id(), '_videoSettingsButton')}"><xsl:value-of select="$translationRoot/field[@name='videoSettingsButton']/text()" /></div>
			<div class="button" id="{concat(generate-id(), '_interfaceSettingsButton')}"><xsl:value-of select="$translationRoot/field[@name='interfaceSettingsButton']/text()" /></div>
			<div class="button" id="{concat(generate-id(), '_soundSettingsButton')}"><xsl:value-of select="$translationRoot/field[@name='soundSettingsButton']/text()" /></div>
			<div class="button" id="{concat(generate-id(), '_logoutButton')}"><xsl:value-of select="$translationRoot/field[@name='logoutButton']/text()" /></div>
			<div class="buttonSeparateGroup" id="{concat(generate-id(), '_returnToGameButton')}"><xsl:value-of select="$translationRoot/field[@name='returnToGameButton']/text()" /></div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>