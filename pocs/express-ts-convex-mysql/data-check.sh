#!/bin/bash

echo "🔍 MySQL Database Data Check"
echo "============================"

# Check if mysql-db container is running
if ! docker ps | grep -q mysql-db; then
    echo "❌ MySQL container (mysql-db) is not running!"
    echo "💡 Start the containers with: docker-compose up -d"
    exit 1
fi

echo "✅ MySQL container is running"
echo ""

# Function to execute MySQL commands via Docker
mysql_docker_exec() {
    docker exec mysql-db mysql -uappuser -papppassword userdb -e "$1" 2>/dev/null
}

echo "📊 Database Information:"
echo "------------------------"
mysql_docker_exec "SELECT DATABASE() as 'Current Database', VERSION() as 'MySQL Version', NOW() as 'Current Time';"
echo ""

echo "📋 Available Tables:"
echo "--------------------"
mysql_docker_exec "SHOW TABLES;"
echo ""

echo "🏗️  Users Table Structure:"
echo "---------------------------"
mysql_docker_exec "DESCRIBE users;" || echo "❌ Users table not found"
echo ""

echo "📊 Record Counts:"
echo "-----------------"
TABLES=$(mysql_docker_exec "SHOW TABLES;" | tail -n +2)

for table in $TABLES; do
    if [ ! -z "$table" ] && [ "$table" != "Tables_in_userdb" ]; then
        count=$(mysql_docker_exec "SELECT COUNT(*) FROM $table;" | tail -n +2 | head -n 1)
        echo "📦 $table: $count records"
    fi
done
echo ""

echo "👥 Users Data:"
echo "--------------"
mysql_docker_exec "SELECT id, name, email, age, is_active as active, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created FROM users ORDER BY created_at DESC LIMIT 20;"
echo ""

echo "🗂️  Users Table Indexes:"
echo "------------------------"
mysql_docker_exec "SHOW INDEX FROM users;" || echo "❌ No indexes found"
echo ""

echo "📈 Database Status:"
echo "------------------"
mysql_docker_exec "SHOW STATUS WHERE Variable_name IN ('Connections', 'Questions', 'Uptime', 'Threads_connected');"
echo ""

echo "🔍 Raw Table Data (JSON-like format):"
echo "-------------------------------------"
mysql_docker_exec "SELECT CONCAT('{\"id\":\"', id, '\",\"name\":\"', name, '\",\"email\":\"', email, '\",\"age\":', age, ',\"active\":', is_active, ',\"created\":\"', created_at, '\"}') as json_data FROM users ORDER BY created_at DESC;"
echo ""

echo "✅ Database check completed!"
echo ""
echo "💡 Useful commands:"
echo "  - Interactive MySQL shell: docker exec -it mysql-db mysql -uappuser -papppassword userdb"
echo "  - View logs: docker-compose logs mysql"
echo "  - Backup: docker exec mysql-db mysqldump -uappuser -papppassword userdb > backup.sql"