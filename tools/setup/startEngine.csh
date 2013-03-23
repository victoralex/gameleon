#!/bin/csh -f

clear

# Redis
/usr/local/etc/rc.d/redis restart

sleep 1

#
# Login
#

while( 1 )

	echo "Killing Login Server"
	kill -9 `cat /www/login.gameleon.co/daemons/daemon.login.pid` > /dev/null &

	echo "Killing Login Persistent SQL Sync Server"
	kill -9 `cat /www/login.gameleon.co/daemons/daemon.psqlsync.pid` > /dev/null &

	cd /www/login.gameleon.co/daemons/
	
	/usr/local/bin/node daemon.psqlsync.js >> /www/login.gameleon.co/logs/gameleon/activity.log &
	sleep 1
	
	echo "Starting Login"
	
	/usr/local/bin/node daemon.login.js >> /www/login.gameleon.co/logs/gameleon/activity.log

end
