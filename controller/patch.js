class Patch {
    async user(client, body, id) {
        try {
            let sql = `SELECT * FROM users WHERE id=$1 AND password=$2`;
            let params = [id, body.oldpassword];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw "舊密碼錯誤！";
            }
            sql = `UPDATE users SET password=$1 WHERE id=$2 AND password=$3`;
            params = [body.nwepass, id, body.oldpassword];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async product(client, body) {
        try {
            let sql = `UPDATE product SET category=$1 WHERE category=$2`;
            let params = [body.newName, body.typelist2];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Patch;
