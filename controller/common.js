class Common {
    async permis(client, userid) {
        try {
            let sql = `SELECT 
                    companyupdate, 
                    customercreate, customerupdate, customerread, customerdelete, 
                    productscreate, productsupdate, productsread, productsdelete, 
                    invoicecreate, invoiceupdate, invoiceread, invoicedelete, 
                    userscreate, usersupdate, usersread, usersdelete
                FROM permis WHERE userid=$1`;
            let params = [userid];
            let result = await client.query(sql, params);
            return result.rows[0];
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async checkid(client, table, id) {
        try {
            let sql = `SELECT * FROM ${table} WHERE id=$1`;
            let params = [id];
            let result = await client.query(sql, params);
            return result.rows[0];
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Common;
