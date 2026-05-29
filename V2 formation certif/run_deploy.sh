#!/bin/bash
expect -c '
spawn ssh -o StrictHostKeyChecking=no -N -L 5432:127.0.0.1:5432 root@62.72.19.56
expect "*?assword:*"
send "/5Dc9vQlaGa,Gw(Z4,uI\r"
expect eof
' &
TUNNEL_PID=$!
sleep 5
DATABASE_URL="postgresql://smartcodai:Smartcodai2026@127.0.0.1:5432/smartcodai_v2?schema=public" npm run db:push:prod
kill $TUNNEL_PID
