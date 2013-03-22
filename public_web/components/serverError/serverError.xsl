<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- General Template -->
	<xsl:template name="serverError" match="component:serverError">
	    
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='serverError']" />
		
		<div class="component serverError" id="{generate-id()}">
			
			<div class="shatter1"></div>
			<div class="shatter2"></div>
			
		</div>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="serverErrorJS" match="component:serverError" mode="footer">
		
		<!--
		<script type="text/javascript">
			
			Application.loader.addComponent({
								componentID: "serverError",
								componentObject: function() { return Component.serverError; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		-->
		
	</xsl:template>
	
</xsl:stylesheet>