<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:template name="widget:switchButton" match="widget:switchButton">
		<xsl:param name="id" />
		<xsl:param name="checkClass" />
		<xsl:param name="uncheckClass" />
		<xsl:param name="isChecked" />
		<xsl:param name="inputName" />
		<xsl:param name="checkedValue" />
		<xsl:param name="uncheckedValue" />
		<xsl:param name="hoverText" />
		
		<div id="{$id}" title="{$hoverText}">
			<input type="hidden" name="{$inputName}" id="{concat($id, '_hiddenInput')}">
				<xsl:attribute name="value"><xsl:choose>
					<xsl:when test="$isChecked = 0">
						<xsl:value-of select="$uncheckedValue" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$checkedValue" />
					</xsl:otherwise>
				</xsl:choose></xsl:attribute>
			</input>
		</div>
		
		<script type="text/javascript">
			
			Application.loader.addWidget({
								widgetID: "switchButton",
								widgetObject: function() { return Application.widget.switchButton; },
								initArgs: {
									id: '<xsl:value-of select="$id" />',
									checkClass: '<xsl:value-of select="$checkClass" />',
									uncheckClass: '<xsl:value-of select="$uncheckClass" />',
									isChecked: '<xsl:value-of select="$isChecked" />',
									checkedValue: '<xsl:value-of select="$checkedValue" />',
									uncheckedValue: '<xsl:value-of select="$uncheckedValue" />'
								}
							});
			
		</script>
		
	</xsl:template>

</xsl:stylesheet>