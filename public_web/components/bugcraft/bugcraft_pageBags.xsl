<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<!--
		bags Page Template
	-->
	<xsl:template name="bags">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='bags']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_bagsPage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_bagsCloseButton')}"></div>
			
			<div class="inventoryContainer">
				
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_1' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_2' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_3' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_4' )}"></div>
				
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_5' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_6' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_7' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_8' )}"></div>
				
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_9' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_10' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_11' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_12' )}"></div>
				
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_13' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_14' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_15' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_16' )}"></div>
				
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_17' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_18' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_19' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_20' )}"></div>
				
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_21' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_22' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_23' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_24' )}"></div>
				
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_25' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_26' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_27' )}"></div>
				<div class="slot_empty" slotType="inventory" classSelected="slot_full" classDisabled="slot_disabled" classNotSelected="slot_empty" id="{concat( generate-id(), '_inventoryItem_2_28' )}"></div>
				
			</div>
			
			<div class="bagsPlayerCurrency" id="{concat(generate-id(), '_bagsCurrency')}"></div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>