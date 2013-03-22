<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:site="http://site.emotionconcept.ro" version="1.0">
	
	<!-- Libraries Includes -->
	<xsl:include href="../../libraries/functions.inc.xsl" />
	
    <!-- Components Includes -->
	<xsl:include href="../../components/appJS/appJS.xsl"/>
	<xsl:include href="../../components/headerMeta/headerMeta.xsl"/>
	<xsl:include href="../../components/headerStyle/headerStyle.xsl"/>
	<xsl:include href="../../components/helperOptimize/helperOptimize.xsl"/>
	<xsl:include href="../../components/customerLogo/customerLogo.xsl"/>
	<xsl:include href="../../components/translationEditor/translationEditor.xsl"/><xsl:include href="../../components/footerCopyright/footerCopyright.xsl"/><xsl:include href="../../components/rssFeedFront/rssFeedFront.xsl"/>
	
    <!-- Output -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/> 
	<xsl:output doctype-public="-//W3C//DTD HTML 4.01//EN"/>
	
    <!-- Global Variables -->
	<xsl:variable name="configuration" select="document('../../configuration/configuration.xml')/configuration"/>
	<xsl:variable name="translation" select="document(concat($configuration/siteProtocol, '://', $configuration/siteURL/text(), '/pages/translationEditor/configuration/translations/translationEditor.', //application/@lang, '.xml'))/translation"/>
	
    <!-- Layout Template -->
	<xsl:template name="root" match="//application">
		
		<html>
			<head>
				<xsl:apply-templates select="components/site:meta" mode="header"/>
				<xsl:apply-templates select="components/site:meta"/>
			</head>
			<body>
				
				<div class="pageContainer">
					
					<div class="header">
						
						<xsl:apply-templates select="components/site:layout/site:header"/>
						
					</div>
					<div class="body">
						
						<xsl:apply-templates select="components/site:layout/site:body"/>
						
					</div>
					<div class="footer">
						
						<xsl:apply-templates select="components/site:layout/site:footer"/>
						
					</div>
				</div>
				
				<xsl:apply-templates select="components/site:layout/site:body" mode="footer"/>
				<xsl:apply-templates select="components/site:layout/site:footer" mode="footer"/>
				
			</body>
		</html>
		
	</xsl:template>
	
</xsl:stylesheet>
