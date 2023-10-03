const { Pool } = require("pg");

//連接PG資料庫
class Conndb {
    async connectpgdb() {
        const conn = process.env;
        let pool = new Pool({
            user: conn.user,
            host: conn.host,
            database: conn.database,
            password: conn.password,
            port: conn.port,
            ssl: {
                rejectUnauthorized: false // 禁用SSL驗證
            }
        });
        try {
            const client = await pool.connect();
            return client;
        } catch (err) {
            pool.end();
            console.error(err);
        }
    }
}

module.exports = Conndb;
