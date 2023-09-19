class Get {
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

    async track(client) {
        // 只顯示當期跟前期
        const currentDate = new Date();
        let month = 0;
        if (currentDate.getMonth() % 2 === 0) {
            month = currentDate.getMonth() + 2;
        } else {
            month = currentDate.getMonth() + 1;
        }
        // getFullYear 因為是西元年減去 1911 要再乘以 100 來加上月份
        const current = (currentDate.getFullYear() - 1911) * 100 + month;
        const last = current - 2;
        try {
            const sql = `SELECT id, type, yearmonth, tnum, beginno, endno, usedno, disabled FROM track WHERE yearmonth=$1 OR yearmonth=$2`;
            const params = [current, last];
            const result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Get;
