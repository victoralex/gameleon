<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="widget:rotator" match="widget:rotator">
		<xsl:param name="activeArea" />
		<xsl:param name="visibleClass" />
		<xsl:param name="hiddenClass" />
		
		<script type="text/javascript">
			
			Application.loader.addWidget({
								widgetID: "rotator",
								widgetObject: function() { return Application.widget.rotator; },
								initArgs: {
									activeArea: '<xsl:value-of select="$activeArea" />',
									visibleClass: '<xsl:value-of select="$visibleClass" />',
									hiddenClass: '<xsl:value-of select="$hiddenClass" />'
								}
							});
			
		</script>
		
	</xsl:template>

</xsl:stylesheet>