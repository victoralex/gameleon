<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<!--
		Character Switch / New Character template
	-->
	<xsl:template name="selectCharacter">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='selectCharacter']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="component bugcraft" id="{generate-id()}">
			
			<div class="selectCharacterPage middle" id="{concat(generate-id(), '_switchCharacterPage')}">
				
				<!--
				<div class="tabs">
					
					<a class="tab" href="/selectCharacter#charactersList" id="{concat(generate-id(), '_tabTitle1')}">
						<span class="tabLeft"></span>
						<span class="tabMiddle"><xsl:value-of select="$translationRoot/field[@name='selectCharacterMenuItemCharacterList']/text()" /></span>
						<span class="tabRight"></span>
					</a>
					<a class="tab" href="/selectCharacter#newCharacter" id="{concat(generate-id(), '_tabTitle2')}">
						<span class="tabLeft"></span>
						<span class="tabMiddle"><xsl:value-of select="$translationRoot/field[@name='selectCharacterMenuItemNew']/text()" /></span>
						<span class="tabRight"></span>
					</a>
					
				</div>
				-->
				
				<!--
						Existing Character
				-->
				
				<div id="{concat(generate-id(), '_tabContent1')}" class="hidden">
					
					<div class="characterSelect">
					
						<h1>Select your character</h1>
						
						<div class="characters">
						
							<div class="charactersList">
								
								<div class="listContainer" id="{concat(generate-id(), '_charactersListContainer')}">
									<div class="list" id="{concat(generate-id(), '_charactersList')}"></div>
								</div>
								
								<div class="navigation">
								
									<div class="upButton" id="{concat(generate-id(), '_upButton')}"></div>
									<div class="downButton" id="{concat(generate-id(), '_downButton')}"></div>
									
								</div>
								
							</div>
							
							<div class="selectedCharacter">
								
								<div class="selectedCharacterImage" id="{concat(generate-id(), '_selectedCharacterImage')}"></div>
								<div class="selectedCharacterNameContainer" id="{concat(generate-id(), '_selectedCharacterNameContainer')}"></div>
							
							</div>
							
							<div class="options">
								<div class="goBack" id="{concat(generate-id(), '_backButton')}" title="{$translationRoot/field[@name='changeRealmText']/text()}"></div>
								<div class="deleteCharacter" id="{concat(generate-id(), '_deleteCharacterButton')}" title="{$translationRoot/field[@name='deleteCharacterText']/text()}"></div>
								<div class="newCharacter" id="{concat(generate-id(), '_newCharacterButton')}" title="{$translationRoot/field[@name='newCharacterText']/text()}"></div>
								<div class="loginCharacter" id="{concat(generate-id(), '_loginCharacterButton')}" title="{$translationRoot/field[@name='loginCharacterText']/text()}"></div>
							</div>
							
						</div>
					
					</div>
					
				</div>
				
				
					<!--
							New Character
					-->
					
				<div id="{concat(generate-id(), '_tabContent2')}" class="hidden">
					
					<div class="newCharacter">
					
						<div class="factions">
							
							<a href="#newCharacter" id="{concat(generate-id(), '_memberLink1')}" class="member1"></a>
							<a href="#newCharacter" id="{concat(generate-id(), '_memberLink3')}" class="member3"></a>
							<a href="#newCharacter" id="{concat(generate-id(), '_memberLink2')}" class="member2"></a>
							
							<a href="#newCharacter" id="{concat(generate-id(), '_memberLink6')}" class="member6"></a>
							<a href="#newCharacter" id="{concat(generate-id(), '_memberLink5')}" class="member5"></a>
							<a href="#newCharacter" id="{concat(generate-id(), '_memberLink4')}" class="member4"></a>
							
						</div>
						
						<div class="form">
							<div class="goBackButton" id="{concat(generate-id(), '_changeRealmButton')}" title="{$translationRoot/field[@name='goBackText']/text()}"></div>
							<div class="input"><input type="text" id="{concat(generate-id(), '_newCharacterName')}" value="{$translationRoot/field[@name='nameInputDefaultValue']/text()}"/></div>
							<div class="createCharacterButtonDisabled" id="{concat(generate-id(), '_createButton')}" title="{$translationRoot/field[@name='createCharacterText']/text()}"></div>
						</div>
						
						<div class="classDescription">
						
							<!-- Ant -->
							<div class="description hidden" id="{concat(generate-id(), '_description1')}">
								<div class="leftArea">
									<h1>Scout Class</h1>
									<div class="featureScout1">
										<h2>Melee/Ranged</h2>
										<h3>Deadly up-front and ranged adversaries</h3>
										<p>Scouts wield all manner of melee weapons. They enhance their weapons with poisons and venoms to increase their lethal potential or cripple their enemies. Scouts may even learn to fling powerful bolts and sprays from afar.</p>
									</div>
									<div class="featureScout2">
										<h2>Healing</h2>
										<h3>Potent Herbalists and Alchemists</h3>
										<p>Scouts can be valued defenders and healers in a group of insects. By calling on their superior knowledge of herbs and plants, they can prepare oils, salves and potions to restore health to injured allies.</p>
									</div>
									<div class="featureScout3">
										<h2>Abilities</h2>
										<h3>offensive, healing and utility</h3>
										<p>Their abilities allow them to hide in the shadows, pounce on their foes and deal devastating damage while dual-wielding or with ranged bolts, but they can also heal their allies and improve a group’s overall deadliness and survivability.</p>
									</div>
								</div>
								<div class="rightArea">
									<div class="raceDescription">
										<h1>Ant</h1>
										<p>The wilds call out to the wild. Hard working and adventurous, the proud ants never let anything get in the way of progress.</p>
										<p>Their noble spirit is what drove them to adapt to the land and learn its ways.</p>
										<p>Now, generations after the first ants stepped off their arks, the ants have triumphed in taming the wilderness. In the battle that is to come, the land itself is their ally.</p>
									</div>
									
									<div class="racialAnt1">
										<h2>Stalking</h2>
										<h3>Active ability</h3>
										<p>You can command your experience at will, focusing it on the task at hand. You receive a 5% bonus to your attack for 15 seconds.</p>
									</div>
									<div class="racialAnt2">
										<h2>Hardiness</h2>
										<h3>Passive ability</h3>
										<p>Ants have a hardy constitution. You have a natural, permanent 1% bonus to your resistance.</p>
									</div>
								</div>
							</div>
							
							<!-- Fireant -->
							<div class="description hidden" id="{concat(generate-id(), '_description2')}">
								<div class="leftArea">
									<h1>Soldier Class</h1>
									<div class="featureSoldier1">
										<h2>Melee</h2>
										<h3>masters of melee combat</h3>
										<p>Soldiers are masters of close-quarter combat. They get up close and personal with foes, slashing at them with swords, maces, axes and warhammers, and even their own jaws and pincers. They can dual-wield or use two-handed weapons.</p>
									</div>
									<div class="featureSoldier2">
										<h2>Defense</h2>
										<h3>highly armored protectors</h3>
										<p>Soldiers rely on tough shells, heavy armor and high endurance to outlast their foes in battle and defend their allies. They use their resilience to great effect when they draw attention (and damage) away from their more fragile allies.</p>
									</div>
									<div class="featureSoldier3">
										<h2>Abilities</h2>
										<h3>offensive, defensive and utility</h3>
										<p>Soldiers focus mainly on damage dealing and crippling enemies. Through specializing in defensive or offensive tactics, Soldiers can learn new protective or damaging attacks, and they have excellent group utility buffs.</p>
									</div>
								</div>
								<div class="rightArea">
									<div class="raceDescription">
										<h1>Fire Ant</h1>
										<p>Stubborn, hot headed and fiery of temper, the only thing that cools their energetic spirits is adventure and plenty of it.</p>
										<p>That’s what makes them the best fighters the Anterium has ever had.</p>
										<p>How about it? Think you have what it takes to play with fire?</p>
									</div>
									
									<div class="racialFireant1">
										<h2>Fiery Temper</h2>
										<h3>Active ability</h3>
										<p>Beware the quick temper of the Fire Ant! You lash at your opponent, increasing your damage by 5% for 5 seconds.</p>
									</div>
									<div class="racialFireant2">
										<h2>Endurance</h2>
										<h3>Passive ability</h3>
										<p>Fire Ants are renowned for their stamina and endurance. You have a natural 2% permanent bonus to your hit points.</p>
									</div>
								</div>
							</div>
							
							
							<div class="description hidden" id="{concat(generate-id(), '_description3')}">
								<div class="leftArea">
									<h1>Noble Class</h1>
									<div class="featureNoble1">
										<h2>Ranged Combat</h2>
										<h3>Potent long-range casters</h3>
										<p>Nobles wield mighty pheromone and enzime powers, allowing them to deal high amounts of damage from afar, slow and confuse their adversary, dominate their minds and destroy their equipment.</p>
									</div>
									<div class="featureNoble2">
										<h2>Healing</h2>
										<h3>Potent Herbalists and Alchemists</h3>
										<p>The power of pheromones allows Nobles to use their abilities to restore the health of of their allies, protect them from harm, improve their endurance and guide groups through dangerous situations.</p>
									</div>
									<div class="featureNoble3">
										<h2>Abilities</h2>
										<h3>offensive, healing and utility</h3>
										<p>Noble abilities focus on damage dealing, healing and protection and crowd control. They rely on staying at range for survival, and groups rely on them for healing and support, as well as massive up-front or poisons that gnaw at enemies health over longer periods of time.</p>
									</div>
								</div>
								<div class="rightArea">
									<div class="raceDescription">
										<h1>Butterfly</h1>
										<p>Long ago, the butterflies looked down upon the arks that made it across the sea.</p>
										<p>Always in pursuit of knowledge, the delicate looking natives earned the respect and trust of the newcomers to the extent that their wisdom is now part of the driving force behind the Anterium</p>
										<p>Wise and crafty, their minds are dangerous playgrounds for powers that demand respect for these noble citizens.</p>
									</div>
									
									<div class="racialButterfly1">
										<h2>Powder Cloud</h2>
										<h3>Active ability</h3>
										<p>Your wings stir up a cloud of white powder, increasing your defense by 10% for 10 seconds, and giving you a moment of respite.</p>
									</div>
									<div class="racialButterfly2">
										<h2>Diplomacy</h2>
										<h3>Passive ability</h3>
										<p>Butterflies are natural diplomats, and this increases their reputation gain by 5%.</p>
									</div>
								</div>
							</div>
							
							
							<div class="description hidden" id="{concat(generate-id(), '_description4')}">
								<div class="leftArea">
									<h1>Noble Class</h1>
									<div class="featureNoble1">
										<h2>Ranged Combat</h2>
										<h3>Potent long-range casters</h3>
										<p>Nobles wield mighty pheromone and enzime powers, allowing them to deal high amounts of damage from afar, slow and confuse their adversary, dominate their minds and destroy their equipment.</p>
									</div>
									<div class="featureNoble2">
										<h2>Healing</h2>
										<h3>Potent Herbalists and Alchemists</h3>
										<p>The power of pheromones allows Nobles to use their abilities to restore the health of of their allies, protect them from harm, improve their endurance and guide groups through dangerous situations.</p>
									</div>
									<div class="featureNoble3">
										<h2>Abilities</h2>
										<h3>offensive, healing and utility</h3>
										<p>Noble abilities focus on damage dealing, healing and protection and crowd control. They rely on staying at range for survival, and groups rely on them for healing and support, as well as massive up-front or poisons that gnaw at enemies health over longer periods of time.</p>
									</div>
								</div>
								<div class="rightArea">
									<div class="raceDescription">
										<h1>Bee</h1>
										<p>Noble and majestic, the bees are the rulling class behind the hegemony.</p>
										<p>In the early days of colonisation, their shrewed cunning enabled them to take charge of what was to become one of the greatest nations in history.</p>
										<p>Keepers of powerful magic and lore, the bees jealously guard their place as the Hegemony’s elite.</p>
									</div>
									
									<div class="racialBee1">
										<h2>Bee Sting</h2>
										<h3>Active ability</h3>
										<p>You jab your stinger into the enemy bug, stunning him and reducing his defense by 10%. Lasts 3 seconds.</p>
									</div>
									<div class="racialBee2">
										<h2>Honeymaking</h2>
										<h3>Passive ability</h3>
										<p>The legendary honeymaking prowess of bees serves you well. Your balms, nectars and acids are far more potent, as you receive a 1% permanent bonus to potency.</p>
									</div>
								</div>
							</div>
							
							
							<!-- Ladybug -->
							<div class="description hidden" id="{concat(generate-id(), '_description5')}">
								<div class="leftArea">
									<h1>Scout Class</h1>
									<div class="featureScout1">
										<h2>Melee/Ranged</h2>
										<h3>Deadly up-front and ranged adversaries</h3>
										<p>Scouts wield all manner of melee weapons. They enhance their weapons with poisons and venoms to increase their lethal potential or cripple their enemies. Scouts may even learn to fling powerful bolts and sprays from afar.</p>
									</div>
									<div class="featureScout2">
										<h2>Healing</h2>
										<h3>Potent Herbalists and Alchemists</h3>
										<p>Scouts can be valued defenders and healers in a group of insects. By calling on their superior knowledge of herbs and plants, they can prepare oils, salves and potions to restore health to injured allies.</p>
									</div>
									<div class="featureScout3">
										<h2>Abilities</h2>
										<h3>offensive, healing and utility</h3>
										<p>Their abilities allow them to hide in the shadows, pounce on their foes and deal devastating damage while dual-wielding or with ranged bolts, but they can also heal their allies and improve a group’s overall deadliness and survivability.</p>
									</div>
								</div>
								<div class="rightArea">
									<div class="raceDescription">
										<h1>Ladybug</h1>
										<p>Skilled scouts and marksmen, the ladybugs have proven their value again and again in the years leading up to the current troubled peace with the Anterium.</p>
										<p>Despite the lack of conflict, these valiant adventurers have not allowed their skills to dull.</p>
										<p>When a mission requires finess, then the Hegemony leadership knows exactly where to find its volunteers.</p>
									</div>
									
									<div class="racialLadybug1">
										<h2>Foul Taste</h2>
										<h3>Active ability</h3>
										<p>Ladybugs are notorious for the disgusting taste of their flesh and blood. If you are bleeding, you may stun your opponent for 2 seconds.</p>
									</div>
									<div class="racialLadybug2">
										<h2>Deception</h2>
										<h3>Passive ability</h3>
										<p>You are a vile trickster. You have a natural, permanent 1% bonus to your defense.</p>
									</div>
								</div>
							</div>
							
							
							<!-- Mantis -->
							<div class="description hidden" id="{concat(generate-id(), '_description6')}">
								<div class="leftArea">
									<h1>Soldier Class</h1>
									<div class="featureSoldier1">
										<h2>Melee</h2>
										<h3>masters of melee combat</h3>
										<p>Soldiers are masters of close-quarter combat. They get up close and personal with foes, slashing at them with swords, maces, axes and warhammers, and even their own jaws and pincers. They can dual-wield or use two-handed weapons.</p>
									</div>
									<div class="featureSoldier2">
										<h2>Defense</h2>
										<h3>highly armored protectors</h3>
										<p>Soldiers rely on tough shells, heavy armor and high endurance to outlast their foes in battle and defend their allies. They use their resilience to great effect when they draw attention (and damage) away from their more fragile allies.</p>
									</div>
									<div class="featureSoldier3">
										<h2>Abilities</h2>
										<h3>offensive, defensive and utility</h3>
										<p>Soldiers focus mainly on damage dealing and crippling enemies. Through specializing in defensive or offensive tactics, Soldiers can learn new protective or damaging attacks, and they have excellent group utility buffs.</p>
									</div>
								</div>
								<div class="rightArea">
									<div class="raceDescription">
										<h1>Mantis</h1>
										<p>Strong in will and body, the mantis is a skilled warrior and one of the few whose strength can truly match the resilience of a Fire Ant.</p>
										<p>Believing in balance above all else, the mantises dedicate years of their lives to the study of the Natural Equilibrium.</p>
									</div>
									
									<div class="racialMantis1">
										<h2>Mantis Squeeze</h2>
										<h3>Active ability</h3>
										<p>Mantises have powerful arms. You grab your opponent in a pinning embrace, stunning him for 3 seconds.</p>
									</div>
									<div class="racialMantis2">
										<h2>Ambush Predator</h2>
										<h3>Passive ability</h3>
										<p>Mantises are natural predators. You have a natural 1% permanent bonus to your attack.</p>
									</div>
								</div>
							</div>
							
						</div>
							
					</div>
					
				</div>
				
			</div>
		
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>