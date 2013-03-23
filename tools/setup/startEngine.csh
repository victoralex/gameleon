#!/bin/csh -f

# Redis
/usr/local/etc/rc.d/redis restart

sleep 1

#
# Realm - Harendar
#

# The realm will run on a continous loop. If it fails, it will automatically restart, and with it, all the processes


cd /www/harendar.gameleon.co/daemons/

echo "Killing Realm Persistent SQL Sync Server"
kill -9 `cat ./daemon.psqlsync.pid` > /dev/null &

echo "Killing Achievement Server"
kill -9 `cat ./daemon.achievementServer.pid` > /dev/null &

echo "Killing Quest Server"
kill -9 `cat ./daemon.questServer.pid` > /dev/null &

sleep 1

/usr/local/bin/node ./daemon.psqlsync.js >> /www/harendar.gameleon.co/logs/gameleon/activity.log &

/usr/local/bin/node ./daemon.questServer.js >> /www/harendar.gameleon.co/logs/gameleon/activity.log &

/usr/local/bin/node ./daemon.achievementServer.js >> /www/harendar.gameleon.co/logs/gameleon/activity.log &

sleep 1

echo "Starting Realm"
/usr/local/bin/node ./daemon.realm.js >> /www/harendar.gameleon.co/logs/gameleon/activity.log &

  
