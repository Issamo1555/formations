#!/usr/bin/expect -f
set timeout 15
spawn ssh -o StrictHostKeyChecking=no root@62.72.19.56 "docker ps -a"
expect "*?assword:*"
send "/5Dc9vQlaGa,Gw(Z4,uI\r"
expect eof
