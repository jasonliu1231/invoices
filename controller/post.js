const crypto = require("crypto");
class Post {
    async company(client, body) {
        try {
            let sql = `INSERT INTO seller(
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
            let sql = `INSERT INTO customer(
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
            let sql = `INSERT INTO product(
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
                body.category,
            ];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Post;
