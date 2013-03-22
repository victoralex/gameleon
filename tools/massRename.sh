#!/bin/sh

for file in `ls npcs_*`
do
   new_name=`echo $file | sed 's/^npcs_//;s/.ent/.txt/'`
   mv $file $new_name
done
