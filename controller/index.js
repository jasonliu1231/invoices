const crypto = require("crypto");
class Index {
    async session(client, token) {
        try {
            const sql = `SELECT * FROM session WHERE token=$1`;
            const params = [token];
            const result = await client.query(sql, params);
            return result.rows[0]
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async login(client, body) {
        try {
            client.query("BEGIN");
            let sql = `SELECT id, name FROM users WHERE name=$1 AND password=$2 AND disabled=$3`;
            let params = [body.user, body.password, 0];
            let result = await client.query(sql, params);
            // 如果有資料檢查有沒有登入過
            const token = crypto.randomUUID();
            let userInfo = result.rows[0];
            if (userInfo) {
                sql = `SELECT * FROM session WHERE userid=$1`;
                params = [userInfo.id];
                result = await client.query(sql, params);
                // 如果有登入過給予新的 token，沒有就新增一筆 session 資料
                if (!result.rows[0]) {
                    sql = `INSERT INTO session(token, userid, username) VALUES ($1, $2, $3);`;
                    params = [token, userInfo.id, userInfo.name];
                    result = await client.query(sql, params);
                } else {
                    sql = `UPDATE session SET token=$1 WHERE userid=$2;`;
                    params = [token, userInfo.id];
                    result = await client.query(sql, params);
                }
            } else {
                throw "帳號密碼錯誤或是該用戶停用中！！";
            }
            client.query("COMMIT");

            userInfo.token = token;
            return userInfo;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async logout(client, token) {
        try {
            const sql = `DELETE FROM session WHERE token=$1`;
            const params = [token];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Index;
