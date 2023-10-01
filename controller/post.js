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
            client.query("BEGIN");
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
            client.query("COMMIT");
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async invoice(client, userid, body) {
        const id = crypto.randomUUID();
        const randomnumber = Math.floor(Math.random() * 10000) + 1;
        const invoiceMain = body.invoiceMain;
        const invoiceDetails = body.invoiceDetails;
        const invoiceAmount = body.invoiceAmount;
        try {
            const date = invoiceMain.invoiceDate.split("-");
            const year = Number(date[0]);
            let month = Number(date[1]);
            month % 2 != 0 && month++;
            const currentTrack = (year - 1911) * 100 + month;

            // getinvoicenumber($1, $2, $3) 為自訂 SQL 函數，$1 代表票軌的類別，$2 代表票軌的期別，$1 代表發票的年份
            let sql = `SELECT getinvoicenumber($1, $2, $3)`;
            let params = [invoiceMain.invoiceType, currentTrack, year];
            let result = await client.query(sql, params);
            const inum = result.rows[0].getinvoicenumber;
            if (inum === null) {
                throw "沒有可使用的發票號碼！";
            }

            client.query("BEGIN");
            sql = `INSERT INTO invoice(
                    id, inum, date, "time", tracknumbertype, randomnumber, state, totalamount, taxtype, taxrate, taxamount, freetaxsalesamount, 
                    zerotaxsalesamount, cnoteamount, voiddate, voidtime, voidreason, voiddnum, voidremark, buyerunum, buyername, buyertel, buyermail, 
                    buyeraddr, carriertype, carrierid1, carrierid2, mainremark, clearancemark, groupmark, printmark, donatemark, npoban, 
                    createby, customerid)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, 
                    $27, $28, $29, $30, $31, $32, $33, $34, $35);`;
            params = [
                id,
                inum,
                invoiceMain.invoiceDate.replace(/-/g, ""),
                invoiceMain.invoiceTime,
                invoiceMain.invoiceType,
                randomnumber.toString().padStart(4, 0),
                "1",
                invoiceAmount.totalAmount,
                invoiceAmount.taxType,
                invoiceAmount.taxRate,
                invoiceAmount.taxAmount,
                invoiceAmount.freeTaxSalesAmount,
                invoiceAmount.zeroTaxSalesAmount,
                0,
                null,
                null,
                null,
                null,
                null,
                invoiceMain.buyer.id,
                invoiceMain.buyer.name,
                invoiceMain.buyer.tel,
                invoiceMain.buyer.email,
                invoiceMain.buyer.address,
                invoiceMain.carrierType,
                invoiceMain.carrierId1,
                invoiceMain.carrierId2,
                invoiceMain.mainRemark,
                invoiceMain.customsClearanceMark,
                invoiceMain.groupMark,
                invoiceMain.printMark,
                invoiceMain.donateMark,
                invoiceMain.npoban,
                userid,
                body.id
            ];
            await client.query(sql, params);

            for (let i = 0; i < invoiceDetails.length; i++) {
                const productItem = invoiceDetails[i];
                sql = `INSERT INTO invoicedetail(
                    invoiceid, unitprice, quantity, productname, unit)
                    VALUES ($1, $2, $3, $4, $5)`;
                params = [
                    id,
                    productItem.unitPrice,
                    productItem.quantity,
                    productItem.description,
                    productItem.unit
                ];
                await client.query(sql, params);
            }

            client.query("COMMIT");

            // 從剛剛確定儲存的發票中撈出資料修改已使用號碼
            sql = `SELECT inum FROM invoice WHERE id=$1`;
            params = [id];
            result = await client.query(sql, params);
            const tnum = result.rows[0].inum.substr(0, 2);
            const usedno = Number(result.rows[0].inum.substr(2, 8));
            sql = `UPDATE track SET usedno=$1, disabled=false WHERE tnum=$2 AND beginno<=$1 AND endno>=$1;`;
            params = [usedno, tnum];
            await client.query(sql, params);

            return { inum, id };
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Post;
