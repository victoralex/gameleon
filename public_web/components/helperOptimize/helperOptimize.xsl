<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Server-Side structure -->
	<xsl:variable name="helperOptimizeData" select="document(concat($configuration/siteProtocol, '://', $configuration/siteURL/text(), '/component.php?component=helperOptimize'))" />
	
	<!-- General Template -->
	<xsl:template name="helperOptimize" match="component:helperOptimize">
	    
		<xsl:if test="$helperOptimizeData/header/result/text() = '200'">
			
			
			
		</xsl:if>
		
	</xsl:template>
	
</xsl:stylesheet>