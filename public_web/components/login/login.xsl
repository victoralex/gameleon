<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Server-Side Data -->
	<xsl:variable name="loginServerData" select="document('/component.php?component=login&amp;event=list')" />
	
	<!-- Component Configuration -->
	<xsl:variable name="loginClientConfig" select="document(concat('/pages/', //application/values/get/@page, '/configuration/components/login/client/configuration.xml'))/configuration" />
	
	<!-- General Template -->
	<xsl:template name="login" match="component:login">
	    
		<div class="component login" id="{generate-id()}">
			
			<div class="logo"></div>
			<div class="loaderContainer">
				<div class="loader"></div>
			</div>
			
		</div>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="loginJS" match="component:login" mode="footer">
		
		<script type="text/javascript">
			
			Application.loader.addComponent({
								componentID: "login",
								componentObject: function() { return Component.login; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		
	</xsl:template>
	
</xsl:stylesheet>