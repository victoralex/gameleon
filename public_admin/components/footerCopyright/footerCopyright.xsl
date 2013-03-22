<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- General Template -->
	<xsl:template name="footerCopyright" match="component:footerCopyright">
		
		<xsl:variable name="translationRoot" select="$translation/component[@name='footerCopyright']" />
		
		<div class="footerCopyright">
			
			<span class="copyright">
				<xsl:value-of select="$translationRoot/custom/field[@name='copyright']/text()" disable-output-escaping="yes" />
			</span>
			
			<ul class="menu">
				
				<xsl:for-each select="menu/entry">
					
					<xsl:variable name="entryID" select="@id" />
					
					<li>
						<a>
							<xsl:attribute name="href">
								<xsl:choose>
									<xsl:when test="@page = 'content'">index.php?page=content&amp;contentID=<xsl:value-of select="@contentID" /></xsl:when>
									<xsl:when test="@type = 'external'"><xsl:value-of select="@url" /></xsl:when>
									<xsl:otherwise>index.php?page=<xsl:value-of select="@page" />&amp;show=<xsl:value-of select="@show" /></xsl:otherwise>
								</xsl:choose>
							</xsl:attribute>
							
							<xsl:value-of select="$translationRoot/menu/entry[@id = $entryID]/text()" />
						</a>
					</li>
					
				</xsl:for-each>
				
			</ul>
			
		</div>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="footerCopyrightJS" match="component:footerCopyright" mode="footer">
		
		<!--
		<script type="text/javascript">
			
			Application.loader.addComponent({
								component: function() { return Component.footerCopyright; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		<script type="text/javascript" src="/components/footerCopyright/public/component.footerCopyright.js"></script>
		-->
		
	</xsl:template>
	
</xsl:stylesheet>