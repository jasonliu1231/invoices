const crypto = require("crypto");
class Post {
    async company(client, body) {
        try {
            const sql = `INSERT INTO seller(
                unum, name, personincharge, taxid, companyaddress, connectionaddress, tel, facsimilenumber, email, roleremark, printtype, invoicetitleimage, customname)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
            const params = [
                body.unum,
                body.name,
                body.personInCharge,
                body.taxId,
                body.companyAddress,
                body.connectionAddress,
                body.tel,
                body.facsimileNumber,
                body.email,
                body.roleremark,
                body.printType,
                body.inputImg,
                body.customName
            ];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async customer(client, body) {
        try {
            const sql = `INSERT INTO customer(
                id, name, unum, type, recipient, address, tel, email, carrierid, npoban, roleremark, mobile, memberid)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
            const params = [
                crypto.randomUUID(),
                body.name,
                body.unum,
                body.type,
                body.recipient,
                body.address,
                body.tel,
                body.email,
                body.carrierid,
                body.npoban,
                body.roleremark,
                body.mobile,
                body.memberid
            ];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async product(client, body) {
        try {
            const sql = `INSERT INTO product(
                id, no, name, unit, price, remark, barcode, category)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
            const params = [
                crypto.randomUUID(),
                body.no,
                body.name,
                body.unit,
                body.price,
                body.remark,
                body.barcode,
                body.category
            ];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async user(client, body) {
        const id = crypto.randomUUID();
        try {
            let sql = `SELECT * FROM users WHERE name=$1 `;
            let params = [body.name];
            let result = await client.query(sql, params);
            if (result.rows.length != 0) {
                throw "名稱已經存在！";
            }
            client.query("BEGIN");
            sql = `INSERT INTO users(
                id, name, password, disabled)
                VALUES ($1, $2, $3, $4)`;
            params = [id, body.name, body.password, body.type];
            await client.query(sql, params);
            sql = `INSERT INTO permis(
                userid, companyupdate, customercreate, customerupdate, customerread, customerdelete, 
                productscreate, productsupdate, productsread, productsdelete, 
                invoicecreate, invoiceupdate, invoiceread, invoicedelete, 
                userscreate, usersupdate, usersread, usersdelete)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`;
            params = [
                id,
                body.companyupdate,
                body.customercreate,
                body.customerupdate,
                body.customerread,
                body.customerdelete,
                body.productscreate,
                body.productsupdate,
                body.productsread,
                body.productsdelete,
                body.invoicecreate,
                body.invoiceupdate,
                body.invoiceread,
                body.invoicedelete,
                body.userscreate,
                body.usersupdate,
                body.usersread,
                body.usersdelete
            ];
            await client.query(sql, params);
            client.query("COMMIT");
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async track(client, body) {
        try {
            for (let i = 0; i < body.length; i++) {
                const id = crypto.randomUUID();
                const track = body[i];
                let sql = `SELECT * FROM seller WHERE unum=$1 `;
                let params = [track.unum];
                let result = await client.query(sql, params);
                if (result.rows.length === 0) {
                    throw "非公司發票，請確認是否為公司統編！";
                }
                const date = track.yearmonth;

                const yearmonth = date.split("~")[1].trim().replace("/", "");
                sql = `SELECT * FROM track WHERE yearmonth=$1 AND tnum=$2 AND beginno=$3 AND endno=$4 `;
                params = [yearmonth, track.tnum, track.beginno, track.endno];
                result = await client.query(sql, params);
                if (result.rows.length != 0) {
                    throw `${track.tnum}${track.beginno} ~ ${track.tnum}${track.endno} 此組已經存在！`;
                }
                sql = `INSERT INTO track(id, type, yearmonth, tnum, beginno, endno, usedno, disabled)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
                params = [
                    id,
                    track.type,
                    yearmonth,
                    track.tnum,
                    track.beginno,
                    track.endno,
                    null,
                    0
                ];
                await client.query(sql, params);
            }
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Post;
