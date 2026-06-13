#!/bin/bash
expect -c '
set timeout -1
spawn ssh -o StrictHostKeyChecking=no root@62.72.19.56 "cd \"/var/www/smartcodai-edu/V2 formation certif\" && git fetch origin && git reset --hard origin/main && docker compose up -d --build && sleep 5 && docker exec smartcodai-edu-app npx tsx prisma/seed-architecture.ts"
expect "*?assword:*"
send "p'\''25BJLtpHUH-q(vvqHE\r"
expect eof
'
