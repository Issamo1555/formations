#!/bin/bash
expect -c '
spawn ssh -o StrictHostKeyChecking=no -N -L 5432:127.0.0.1:5432 root@62.72.19.56
expect "*?assword:*"
send "/5Dc9vQlaGa,Gw(Z4,uI\r"
expect eof
' &
TUNNEL_PID=$!
echo "⏳ Attente du tunnel SSH..."
sleep 5
echo "🚀 Exécution du script de seed d'architecture sur la base de données distante..."
DATABASE_URL="postgresql://smartcodai:Smartcodai2026@127.0.0.1:5432/smartcodai_v2?schema=public" npx tsx prisma/seed-architecture.ts
echo "🛑 Arrêt du tunnel SSH..."
kill $TUNNEL_PID
echo "✅ Terminé !"
