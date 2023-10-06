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
            throw "資料庫錯誤！原因：" + err;
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
            throw "資料庫錯誤！原因：" + err;
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
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async customerFromInvoice(client, condition) {
        try {
            const sql = `SELECT 
                            id, name, unum, type, recipient, address, tel, email, carrierid, npoban, mobile
                        FROM customer
                        WHERE tel LIKE $1 OR mobile LIKE $1 OR name LIKE $1 OR unum LIKE $1 OR roleremark LIKE $1 `;
            const params = [`%${condition}%`];
            const result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async allproducts(client) {
        try {
            const sql = `SELECT 
                            id, name, price, unit, category 
                        FROM product ORDER BY category`;
            const result = await client.query(sql);
            return result.rows;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
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
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async searchProduct(client, condition) {
        try {
            const sql = `SELECT 
                            name, unit, price
                        FROM product WHERE no LIKE $1 OR name LIKE $1 OR barcode LIKE $1`;
            const params = [`%${condition}%`];
            const result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async alluser(client) {
        try {
            const sql = `SELECT id, name, disabled FROM users `;
            const result = await client.query(sql);
            return result.rows;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
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
            throw "資料庫錯誤！原因：" + err;
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
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async invoiceLastDate(client) {
        try {
            const sql = `SELECT date FROM invoice ORDER BY date DESC LIMIT 1`;
            const result = await client.query(sql);
            return result.rows[0];
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async invoiceByInum(client, inum, type) {
        const invoiceInfo = {};
        try {
            let sql = `SELECT id, inum, date, cnoteamount, taxrate, totalamount, taxamount, taxtype, randomnumber, isprint FROM invoice WHERE inum=$1`;
            // 不同情況判斷條件不同，折讓要檢查發票可折讓額，作廢要檢查狀態跟是否折讓過。
            if (type === "cnote") {
                sql += ` AND (totalamount - taxamount) >= cnoteamount`;
            } else if (type === "void") {
                sql += ` AND cnoteamount = 0 AND state != '2'`;
            }
            sql += ` LIMIT 1`;
            let params = [inum];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw `查詢不到 ${inum} 的發票！`;
            }
            invoiceInfo.invoiceMain = result.rows[0];
            const invoiceid = result.rows[0].id;

            sql = `SELECT unitprice, quantity, productname, unit FROM invoicedetail WHERE invoiceid=$1`;
            params = [invoiceid];
            result = await client.query(sql, params);
            invoiceInfo.invoiceDetails = result.rows;
            return invoiceInfo;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async invoice(client, start, due, type) {
        try {
            let sql = `SELECT inum, date, totalamount, taxamount, state, name FROM invoice 
                LEFT JOIN users ON users.id = invoice.createby
                WHERE date >= $1 AND date <= $2`;
            if (type === "voidInvoice") {
                sql += ` AND state = '2'`;
            } else if (type === "cnoteInvoice") {
                sql += ` AND cnoteamount != 0`;
            } else if (type === "errorInvoice") {
                sql += ` AND state = '3'`;
            }
            sql += ` ORDER BY date DESC, inum DESC`;
            let params = [start, due];
            let result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async cnotenumber(client, today) {
        try {
            let sql = `SELECT * FROM cnote WHERE date=$1`;
            let params = [today];
            let result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async cnoteByCnum(client, cnum) {
        try {
            let sql = `SELECT c.id, c.cnum, c.date cdate, c.invoiceid, i.inum, i.date idate, i.cnoteamount, c.totalamount, c.taxamount FROM cnote c
                        LEFT JOIN invoice i ON c.invoiceid=i.id WHERE cnum=$1`;
            let params = [cnum];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw `查詢不到 ${cnum} 的折讓單！`;
            }
            return result.rows[0];
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async cnote(client, start, due) {
        try {
            let sql = `SELECT cnum, date, totalamount, taxamount, state, name FROM cnote
                LEFT JOIN users ON users.id = cnote.createby
                WHERE date >= $1 AND date <= $2 ORDER BY date DESC, cnum DESC`;
            let params = [start, due];
            let result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    // 列印所需資料，沒有對外 API
    async printInvoiceInfo(client, id) {
        try {
            let sql = `SELECT inum, date, "time", randomnumber, totalamount, taxrate, taxamount, (totalamount-taxamount) salesamount, buyerunum, printmark, mainremark, isprint FROM invoice WHERE id=$1`;
            let params = [id];
            let result = await client.query(sql, params);
            const invoiceMain = result.rows[0];
            sql = `SELECT unitprice, quantity, (unitprice*quantity) amount, productname FROM invoicedetail WHERE invoiceid=$1`;
            result = await client.query(sql, params);
            const invoiceDetails = result.rows;
            sql = `SELECT unum, name, printtype, invoicetitleimage, customname FROM seller`;
            result = await client.query(sql);
            const seller = result.rows[0];

            return { invoiceMain, invoiceDetails, seller };
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    // 列印所需資料，沒有對外 API
    async printCnoteInfo(client, id) {
        try {
            let sql = `SELECT c.cnum, c.date cdate, c.totalamount, c.taxamount,(c.totalamount-c.taxamount) saleamount, i.inum, i.date idate, i.buyerunum, i.buyername
                    FROM cnote c LEFT JOIN invoice i ON i.id=c.invoiceid WHERE i.id=$1`;
            let params = [id];
            let result = await client.query(sql, params);
            const cnoteMain = result.rows[0];
            sql = `SELECT cd.unitprice, cd.quantity, id.productname, (cd.unitprice * cd.quantity) amount FROM cnotedetail cd
                    LEFT JOIN cnote c ON c.id=cd.cnoteid
                    LEFT JOIN invoice i ON i.id=c.invoiceid
                    LEFT JOIN invoicedetail id ON c.invoiceid=id.invoiceid AND id.productname = cd.productname AND id.unit = cd.unit
                    WHERE i.id=$1`;
            result = await client.query(sql, params);
            const cnoteDetails = result.rows;
            sql = `SELECT unum, name, printtype, invoicetitleimage, customname FROM seller`;
            result = await client.query(sql);
            const seller = result.rows[0];

            return { cnoteMain, cnoteDetails, seller };
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    // XML所需資料，沒有對外 API
    async C0401Info(client, id) {
        try {
            let sql = `SELECT inum, date, "time", tracknumbertype, randomnumber, totalamount, taxtype, taxrate, taxamount, 
                        (totalamount-taxamount) salesamount, freetaxsalesamount, zerotaxsalesamount, cnoteamount, buyerunum, 
                        buyername, buyertel, buyermail, buyeraddr, carriertype, carrierid1, carrierid2, mainremark, clearancemark, 
                        groupmark, printmark, donatemark, npoban
                    FROM invoice WHERE id=$1`;
            let params = [id];
            let result = await client.query(sql, params);
            const invoiceMain = result.rows[0];
            sql = `SELECT unitprice, quantity, productname, unit, (unitprice*quantity) amount FROM invoicedetail WHERE invoiceid=$1`;
            result = await client.query(sql, params);
            const invoiceDetails = result.rows;
            sql = `SELECT unum, name, personincharge, companyaddress, tel, facsimilenumber, email, roleremark FROM seller`;
            result = await client.query(sql);
            const seller = result.rows[0];

            return { invoiceMain, invoiceDetails, seller };
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    // XML所需資料，沒有對外 API
    async D0401Info(client, id) {
        try {
            let sql = `SELECT c.cnum, c.date, c.side, c.totalamount, c.taxamount, i.buyerunum, i.buyername, i.buyertel, i.buyermail, i.buyeraddr
                FROM cnote c LEFT JOIN invoice i ON i.id=c.invoiceid WHERE i.id=$1`;
            let params = [id];
            let result = await client.query(sql, params);
            const cnoteMain = result.rows[0];
            sql = `SELECT cd.unitprice, cd.quantity, cd.taxamount, i.date, i.inum, id.productname, i.taxtype, id.unit, (cd.unitprice * cd.quantity - cd.taxamount) amount
                    FROM cnotedetail cd
                    LEFT JOIN cnote c ON c.id=cd.cnoteid
                    LEFT JOIN invoice i ON i.id=c.invoiceid
                    LEFT JOIN invoicedetail id ON c.invoiceid=id.invoiceid AND id.productname = cd.productname AND id.unit = cd.unit
                WHERE i.id=$1`;
            result = await client.query(sql, params);
            const cnoteDetails = result.rows;
            sql = `SELECT unum, name, personincharge, companyaddress, tel, facsimilenumber, email, roleremark FROM seller`;
            result = await client.query(sql);
            const seller = result.rows[0];

            return { cnoteMain, cnoteDetails, seller };
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    // XML所需資料，沒有對外 API
    async C0501Info(client, id) {
        try {
            const sql = `SELECT i.inum, i.date, CASE WHEN i.buyerunum IS NULL THEN '0000000000' ELSE i.buyerunum END buyerunum, s.unum, i.voiddate, i.voidtime, i.voidreason, i.voiddnum, i.voidremark FROM invoice i
                        LEFT JOIN seller s ON 1=1 WHERE i.id=$1`;
            const params = [id];
            const result = await client.query(sql, params);

            return result.rows[0];
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    // XML所需資料，沒有對外 API
    async D0501Info(client, id) {
        try {
            const sql = `SELECT c.cnum, c.date, CASE WHEN i.buyerunum IS NULL THEN '0000000000' ELSE i.buyerunum END buyerunum, s.unum, c.voiddate, c.voidtime, c.voidreason, c.voidremark FROM cnote c
                        LEFT JOIN invoice i ON c.invoiceid=i.id
                        LEFT JOIN seller s ON 1=1 WHERE c.id=$1`;
            const params = [id];
            const result = await client.query(sql, params);

            return result.rows[0];
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }

    async E0402Info(client, id) {
        try {
            const sql = `SELECT seller.unum, type, yearmonth, tnum, beginno, endno, usedno, disabled FROM track  LEFT JOIN seller ON 1=1 WHERE id=$1`;
            const params = [id];
            const result = await client.query(sql, params);
            return result.rows[0];
        } catch (err) {
            throw "資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Get;
