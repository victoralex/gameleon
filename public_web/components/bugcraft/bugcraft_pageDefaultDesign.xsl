<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<!--
		Default design template
	-->
	
	<xsl:template name="design">
		<xsl:param name="globalID" select="generate-id()" />
		
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='profile']" />
		
		<div class="component bugcraft" id="{$globalID}">
			
			<div class="lagNotification" id="{concat($globalID, '_lagNotificationArea')}"></div>
			
			<div class="top" id="{concat($globalID, '_topAreaContainer')}">
				
				<div class="menuLink" id="{concat($globalID, '_topMenuLink')}">
					<span class="menuItem">
						<div href="#"><xsl:value-of select="$translationRoot/field[@name='menuItemLink']/text()" /></div>
						<div href="#" class="shadow"><xsl:value-of select="$translationRoot/field[@name='menuItemLink']/text()" /></div>
					</span>
				</div>
				
				<div class="mainContent">
					
					<!-- Main Character -->
					<div class="leftCharacter">
						
						<div class="description">
							<div class="name"  id="{concat($globalID, '_characterName')}"></div>
							<div class="class" id="{concat($globalID, '_characterClass')}"></div>
							<div class="race" id="{concat($globalID, '_characterRace')}"></div>
						</div>
						<div class="profile">
							<div class="inCombatHidden" id="{concat($globalID, '_characterCombatMarker')}"></div>
							<div class="icon" id="{concat($globalID, '_characterIcon')}">
								<div class="level">
									<div class="number" id="{concat($globalID, '_characterLevel')}"></div>
									<div class="numberShadow" id="{concat($globalID, '_characterLevelShadow')}"></div>
								</div>
							</div>
							<div class="stats">
								<div class="barExperience">
									<div class="numbers" id="{concat($globalID, '_characterExperienceNumbers')}"></div>
									<div class="filling" id="{concat($globalID, '_characterExperienceFilling')}"></div>
									<div class="ending" id="{concat($globalID, '_characterExperienceEnding')}"></div>
								</div>
								<div class="barHealth">
									<div class="numbers" id="{concat($globalID, '_characterHealthNumbers')}"></div>
									<div class="filling" id="{concat($globalID, '_characterHealthFilling')}"></div>
									<div class="ending" id="{concat($globalID, '_characterHealthEnding')}"></div>
								</div>
								<!--
								<div class="barEnergy">
									<div class="numbers" id="{concat($globalID, '_characterEnergyNumbers')}"></div>
									<div class="filling" id="{concat($globalID, '_characterEnergyFilling')}"></div>
									<div class="ending" id="{concat($globalID, '_characterEnergyEnding')}"></div>
								</div>
								-->
								<div class="buffs">
									<div class="activeBuffs" id="{concat($globalID, '_characterActiveBuffsBar')}"></div>
									<div class="passiveBuffs" id="{concat($globalID, '_characterPassiveBuffsBar')}"></div>
								</div>
							</div>
						</div>
						
					</div>
					
					<!-- Points Area -->
					<div class="zonePointsHidden" id="{concat($globalID, '_zonePointsContainer')}">
						
						<div class="factionAnterium" id="{concat($globalID, '_zonePointsAnterium')}"></div>
						<div class="factionHegemony" id="{concat($globalID, '_zonePointsHegemony')}"></div>
						
					</div>
					
					<!-- Target Character -->
					<div class="rightCharacter hidden" id="{concat($globalID, '_rightCharacter')}">
						
						<div class="description">
							<div class="class" id="{concat($globalID, '_targetClass')}"></div>
							<div class="race" id="{concat($globalID, '_targetRace')}"></div>
							<div class="name" id="{concat($globalID, '_targetName')}"></div>
						</div>
						<div class="profile">
							<div class="stats">
								<div class="barHealth">
									<div class="numbers" id="{concat($globalID, '_targetHealthNumbers')}"></div>
									<div class="filling" id="{concat($globalID, '_targetHealthFilling')}"></div>
									<div class="ending" id="{concat($globalID, '_targetHealthEnding')}"></div>
								</div>
								<div class="buffs">
									<div class="activeBuffs" id="{concat($globalID, '_targetActiveBuffsBar')}"></div>
									<div class="passiveBuffs" id="{concat($globalID, '_targetPassiveBuffsBar')}"></div>
								</div>
							</div>
							<div class="icon" id="{concat($globalID, '_targetIcon')}">
								<div class="level" id="{concat($globalID, '_targetLevel')}">
									<div class="number" id="{concat($globalID, '_targetLevelNumber')}"></div>
									<div class="numberShadow" id="{concat($globalID, '_targetLevelNumberShadow')}"></div>
								</div>
							</div>
						</div>
						
					</div>
					
					<div class="mapArea" id="{concat($globalID, '_mapArea')}">
						
						<div class="mapName">
							<span class="text" id="{concat($globalID, '_mapName')}"></span>
							<span class="shadow" id="{concat($globalID, '_mapNameShadow')}"></span>
						</div>
						
						<div class="minimap" id="{concat($globalID, '_minimap')}">
							<canvas class="minimapCanvas" id="{concat($globalID, '_minimapCanvas')}" />
						</div>
						
					</div>
					
				</div>
				
			</div>
			
			<!--
					Popup notification area
			-->
			
			<div class="popupNotificationArea" id="{concat($globalID, '_popupNotificationArea')}">
				
				
				
			</div>
			
			<!--
					Include Pages
			-->
			
			<xsl:choose>
				<xsl:when test="//application/values/get/@page = 'selectCharacter'">
					
					<xsl:call-template name="selectCharacter" />
					
				</xsl:when>
				<xsl:otherwise>
					
					<!--
						Load up the game interface
					-->
					
					<xsl:call-template name="market" />
					<xsl:call-template name="vendor" />
					<xsl:call-template name="profile" />
					<xsl:call-template name="battle" />
					<xsl:call-template name="spellBook" />
					<xsl:call-template name="talentTree" />
					<xsl:call-template name="lookingForBattleground" />
					<xsl:call-template name="questLog" />
					<xsl:call-template name="settings" />
					<xsl:call-template name="settingsSound" />
					<xsl:call-template name="battlegroundStatistics" />
					<xsl:call-template name="questGiver" />
					<xsl:call-template name="bags" />
					<xsl:call-template name="chat" />
					<xsl:call-template name="lootChoose" />
					
				</xsl:otherwise>
			</xsl:choose>
			
			<div class="hidden" id="{concat($globalID, '_achievementsNotificationArea')}">
				<div class="achievementGlow" id="{concat($globalID, '_achievementGlow')}"></div>
				<div class="achievementShine" id="{concat($globalID, '_achievementShine')}"></div>
				<div class="achievementName" id="{concat($globalID, '_achievementsNotificationAchievementName')}"></div>
			</div>
			
			<div class="bottomActionBar" id="{concat($globalID, '_bottom')}">
				
				<div class="buffs" id="{concat($globalID, '_actionBar1')}"></div>
				<div class="menu">
					<div class="menuItemQuests" href="#" title="Quests" id="{concat(generate-id(), '_bottomBarMenuItem2')}"></div>
					<div class="menuItemProfile" href="#" title="Profile" id="{concat(generate-id(), '_bottomBarMenuItem1')}"></div>
					<div class="menuItemSpellBook" href="#" title="Spell Book" id="{concat(generate-id(), '_bottomBarMenuItem3')}"></div>
					<div class="menuItemTalentTree" href="#" title="Talent Tree" id="{concat(generate-id(), '_bottomBarMenuItem4')}"></div>
					<div class="menuItemBestVendor" href="#" title="Amber Store" id="{concat(generate-id(), '_bottomBarMenuItem5')}"></div>
					<div class="menuItemBags" href="#" title="Bag" id="{concat(generate-id(), '_bottomBarMenuItem8')}"></div>
					<div class="menuItemBattlegroundQueue" href="#" title="Battleground Queue" id="{concat(generate-id(), '_bottomBarMenuItem7')}"><div class="hidden" id="{concat(generate-id(), '_bottomBatMenuItem7Overlay')}"></div></div>
					<div class="menuItemSystem" href="#" title="Settings" id="{concat(generate-id(), '_bottomBarMenuItem6')}"></div>
				</div>
				
			</div>
					
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>