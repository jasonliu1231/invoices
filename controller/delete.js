class Delete {
    async customer(client, id) {
        try {
            await client.query("BEGIN");
            let sql = `SELECT * FROM customer WHERE id=$1 `;
            let params = [id];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw "id 不存在！";
            }
            sql = `DELETE FROM customer WHERE id=$1 `;
            await client.query(sql, params);
            await client.query("COMMIT");
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async product(client, id) {
        try {
            await client.query("BEGIN");
            let sql = `SELECT * FROM product WHERE id=$1 `;
            let params = [id];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw "id 不存在！";
            }
            sql = `DELETE FROM product WHERE id=$1 `;
            await client.query(sql, params);
            await client.query("COMMIT");
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Delete;
