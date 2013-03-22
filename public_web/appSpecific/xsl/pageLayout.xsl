<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:site="http://site.emotionconcept.ro" version="1.0">

	<xsl:template name="root" match="//application">
		
		<html>
			<head>
				<xsl:apply-templates select="components/site:meta" mode="header"/>
				<xsl:apply-templates select="components/site:meta"/>
			</head>
			<body globalID="{generate-id()}">
				
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
				
				<xsl:apply-templates select="components/*" mode="footer"/>
				
			</body>
		</html>
		
	</xsl:template>
	
</xsl:stylesheet>