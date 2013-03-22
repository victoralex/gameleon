#!/bin/sh

echo "Creating OGG files"

/usr/local/bin/dir2ogg -n -w -Q -r -d ../../public_web/appSpecific/mp3/
/usr/local/bin/dir2ogg -n -w -Q -r -d ../../public_web/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/

echo "Creating MP3 files"

for i in `find ../../public_web/appSpecific/mp3/ -name \*.wav -type f`; do

	out=$(ls $i | sed -e 's/.wav//g')
	echo "Processing $i"
	/usr/local/bin/lame --silent --nohist -V2 "$i" "$out.mp3"        #Variable bitrate

done

for i in `find ../../public_web/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds -name \*.wav -type f`; do

	out=$(ls $i | sed -e 's/.wav//g')
	echo "Processing $i"
	/usr/local/bin/lame --silent --nohist -V2 "$i" "$out.mp3"        #Variable bitrate

done
