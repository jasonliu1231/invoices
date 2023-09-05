class Patch {
    async user(client, body, id) {
        try {
            let sql = `SELECT * FROM users WHERE id=$1 `;
            let params = [id];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw "id 不存在！";
            }
            sql = `UPDATE users
                SET password=?
                WHERE id=?;`;
            params = [body.password, id];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Patch;