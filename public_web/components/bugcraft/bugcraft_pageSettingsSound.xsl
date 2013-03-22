<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="settingsSound">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='settingsSound']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_soundSettingsPage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_soundSettingsCloseButton')}"></div>
			
			<div class="options">
				
				<div class="option">
					<div class="optionDescriptiveText">Voice Volume</div>
					<div class="optionSlider" id="{concat(generate-id(), '_sliderContainer1')}">
						<div class="sliderLeft"></div>
						<div class="sliderMiddle"><div class="optionSliderButton" id="{concat(generate-id(), '_sliderButton1')}"></div></div>
						<div class="sliderRight"></div>
					</div>
				</div>
				
				<div class="option">
					<div class="optionDescriptiveText">Music Volume</div>
					<div class="optionSlider" id="{concat(generate-id(), '_sliderContainer2')}">
						<div class="sliderLeft"></div>
						<div class="sliderMiddle"><div class="optionSliderButton" id="{concat(generate-id(), '_sliderButton2')}"></div></div>
						<div class="sliderRight"></div>
					</div>
				</div>
				
				<div class="option">
					<div class="optionDescriptiveText">Effects Volume</div>
					<div class="optionSlider" id="{concat(generate-id(), '_sliderContainer3')}">
						<div class="sliderLeft"></div>
						<div class="sliderMiddle"><div class="optionSliderButton" id="{concat(generate-id(), '_sliderButton3')}"></div></div>
						<div class="sliderRight"></div>
					</div>
				</div>
				
				<div class="option">
					<div class="optionDescriptiveText">Ambient Sounds Volume</div>
					<div class="optionSlider" id="{concat(generate-id(), '_sliderContainer4')}">
						<div class="sliderLeft"></div>
						<div class="sliderMiddle"><div class="optionSliderButton" id="{concat(generate-id(), '_sliderButton4')}"></div></div>
						<div class="sliderRight"></div>
					</div>
				</div>
				
			</div>
			
			<div class="windowTitle">Sound Options</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>