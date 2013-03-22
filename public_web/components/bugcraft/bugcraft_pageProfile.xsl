<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<!--
		Profile Page Template
	-->
	<xsl:template name="profile">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='profile']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_profilePage')}">
			
			<div class="closeButton" id="{concat(generate-id(), '_profileCloseButton')}"></div>
			
			<div class="character">
				
				<div class="characterData">
					
					<!--
						Avatar and Equiped items
					-->
					
					<div id="{concat(generate-id(), '_profileCharacterName')}" class="characterName"></div>
					
					<div id="{concat(generate-id(), '_profileAvatar')}" class="characterAvatar">
						
						<div class="itemHead" slotType="profile" classSelected="itemHeadSelected" classNotSelected="itemHead" id="{concat(generate-id(), '_inventoryItem_1_1')}"></div>
						<div class="itemBracersLeft" slotType="profile" classSelected="itemBracersLeftSelected" classNotSelected="itemBracersLeft" id="{concat(generate-id(), '_inventoryItem_1_2')}"></div>
						<div class="itemBracersRight" slotType="profile" classSelected="itemBracersRightSelected" classNotSelected="itemBracersRight" id="{concat(generate-id(), '_inventoryItem_1_3')}"></div>
						<div class="itemChest" slotType="profile" classSelected="itemChestSelected" classNotSelected="itemChest" id="{concat(generate-id(), '_inventoryItem_1_4')}"></div>
						<div class="itemMainHand" slotType="profile" classSelected="itemMainHandSelected" classNotSelected="itemMainHand" id="{concat(generate-id(), '_inventoryItem_1_5')}"></div>
						<div class="itemOffHand" slotType="profile" classSelected="itemOffHandSelected" classNotSelected="itemOffHand" id="{concat(generate-id(), '_inventoryItem_1_6')}"></div>
						<div class="itemFeet" slotType="profile" classSelected="itemFeetSelected" classNotSelected="itemFeet" id="{concat(generate-id(), '_inventoryItem_1_7')}"></div>
						
					</div>
					
				</div>
				<div class="characterNumeric">
					
					<!--
						Player Statistics
					-->
					
					<div class="characterStats">
						
						<div class="statGroup">
							<div class="statGroupTitle">Attributes</div>
							<div class="statGroupData">
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Hit Points</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_HitPoints')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Strength</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_Strength')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Potency</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_Potency')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Happines</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_Happiness')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Average Item Level</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_AverageItemLevel')}"></div>
								</div>
							</div>
						</div>
						
						<div class="statGroup">
							<div class="statGroupTitle">Combat</div>
							<div class="statGroupData">
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Attack</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_Attack')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Weapon Damage - Main Hand</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_MainHandWeaponDamage')}"></div>
								</div>
								<div class="statGroupDetailContainer" id="{concat(generate-id(), '_profileAttribute_OffHandWeaponDamageContainer')}">
									<div class="statGroupDetailName">Weapon Damage - Off Hand</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_OffHandWeaponDamage')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Hit Chance</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_HitChance')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Crit Chance</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_CritChance')}"></div>
								</div>
							</div>
						</div>
						
						<div class="statGroup">
							<div class="statGroupTitle">Defense</div>
							<div class="statGroupData">
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Armor</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_Armor')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Defense</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_Defense')}"></div>
								</div>
								<div class="statGroupDetailContainer">
									<div class="statGroupDetailName">Resistance</div>
									<div class="statGroupDetailValue" id="{concat(generate-id(), '_profileAttribute_Resistance')}"></div>
								</div>
							</div>
						</div>
						
					</div>
					
				</div>
				
			</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>