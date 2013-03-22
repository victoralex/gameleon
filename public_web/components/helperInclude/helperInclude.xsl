<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Server-Side structure -->
	<xsl:variable name="helperIncludeData" select="document(concat($configuration/siteProtocol, '://', $configuration/siteURL/text(), '/component.php?component=helperInclude&amp;page=', //application/values/get/@page, '&amp;event=updateComponentsToPage' ))" />
	
	<!-- General Template -->
	<xsl:template name="helperInclude" match="component:helperInclude">
	    
		<xsl:if test="$helperIncludeData/header/result/text() = '200'">
			
			
			
		</xsl:if>
		
	</xsl:template>
	
</xsl:stylesheet>