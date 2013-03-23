#!/bin/csh

while( 1 )

  set EXP = "(`cat daemon.psqlsync.pid`|`cat daemon.questServer.pid`|`cat daemon.achievementServer.pid`)";
	
	set DPID = `ps -aux | grep -v grep | grep -v processListener | egrep $EXP | wc -l`
	
	if ( "$DPID" != 3 ) then

		echo "One or more processes are down. Restarting the realm"
		
		kill -9 `cat /www/harendar.gameleon.co/daemons/daemon.realm.pid`
		
		sleep 30 # allow the services to restart before the next iteration
		
	else
		
		#echo "All processes are up"
		
	endif
	
	sleep 2
	
end
