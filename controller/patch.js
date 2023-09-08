class Patch {
    async user(client, body, id) {
        try {
            sql = `UPDATE users SET password=? WHERE id=?;`;
            params = [body.password, id];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Patch;