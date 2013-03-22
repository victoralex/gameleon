<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:template match="component:debugWindow">
		
		<xsl:variable name="componentID" select="generate-id()" />
		
		<div class="debugWindowComponent hidden" id="{$componentID}">
			
			<!--
			<div class="title" id="{concat($componentID, '_title')}">Debug Window</div>
			-->
			
			<div class="content" id="{concat($componentID, '_content')}"><![CDATA[ ]]></div>
			
			<![CDATA[ ]]>
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>