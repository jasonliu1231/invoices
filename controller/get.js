class Get {
    async login(client, body) {
        try {
            const sql = `SELECT 
                            id, u.name AS name, companyupdate, customercreate, customerupdate, customerread, customerdelete, productscreate, 
                            productsupdate, productsread, productsdelete, invoicecreate, invoiceupdate, invoiceread, invoicedelete, 
                            userscreate, usersupdate, usersread, usersdelete, unum 
                        FROM users AS u
                        LEFT JOIN permis AS p ON u.id=p.userid 
                        LEFT JOIN seller ON 1=1 
                        WHERE u.name=$1 AND password=$2 AND disabled=$3`;
            const params = [body.user, body.password, 0];
            const result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async company(client) {
        try {
            const sql = `SELECT 
                            unum, name, personincharge, taxid, companyaddress, connectionaddress, tel, facsimilenumber, 
                            email, roleremark, printtype, invoicetitleimage, customname 
                        FROM seller`;
            const result = await client.query(sql);
            return result.rows;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async allCustomer(client) {
        try {
            const sql = `SELECT 
                            id, name, unum, type, recipient, address, tel, email, carrierid, npoban, roleremark, mobile, memberid
                        FROM customer LIMIT 100`;
            const result = await client.query(sql);
            return result.rows;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async customerFromSetting(client, condition) {
        try {
            const sql = `SELECT 
                            id, name, unum, type, recipient, address, tel, email, carrierid, npoban, roleremark, mobile, memberid
                        FROM customer
                        WHERE tel LIKE $1 OR mobile LIKE $1 OR name LIKE $1 OR unum LIKE $1 OR roleremark LIKE $1 `;
            const params = [`%${condition}%`];
            const result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async allproducts(client) {
        try {
            const sql = `SELECT 
                            id, name, price, category 
                        FROM product ORDER BY category`;
            const result = await client.query(sql);
            return result.rows;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async product(client, id) {
        try {
            const sql = `SELECT 
                            id, no, name, unit, price, remark, barcode, category 
                        FROM product WHERE id=$1`;
            const params = [id];
            const result = await client.query(sql, params);
            return result.rows[0];
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async alluser(client) {
        try {
            const sql = `SELECT id, name, disabled FROM users `;
            const result = await client.query(sql);
            return result.rows;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async user(client, id) {
        try {
            const sql = `SELECT 
                            id, name, disabled, companyupdate, customercreate, customerupdate, customerread, customerdelete, 
                            productscreate, productsupdate, productsread, productsdelete, invoicecreate, invoiceupdate, invoiceread, invoicedelete, 
                            userscreate, usersupdate, usersread, usersdelete 
                        FROM users u 
                        LEFT JOIN permis p ON u.id = p.userid 
                        WHERE id=$1`;
            const params = [id];
            const result = await client.query(sql, params);
            return result.rows[0];
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Get;
