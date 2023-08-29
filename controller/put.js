class Put {
    async company(client, body) {
        try {
            let sql = `UPDATE seller 
            SET unum=$1, name=$2, personincharge=$3, taxid=$4, companyaddress=$5, connectionaddress=$6, tel=$7, facsimilenumber=$8, email=$9, 
            roleremark=$10, printtype=$11, invoicetitleimage=$12, customname=$13`;
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
        } catch (error) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async customer(client, body, id) {
        try {
            let sql = `SELECT * FROM customer WHERE id=$1 `;
            let params = [id];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw "id 不存在！";
            }
            sql = `UPDATE customer 
            SET name=$1, unum=$2, type=$3, recipient=$4, address=$5, tel=$6, email=$7, carrierid=$8, npoban=$9, roleremark=$10, mobile=$11, memberid=$12 
            WHERE id=$13;`;
            params = [
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
                body.memberid,
                id
            ];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async product(client, body, id) {
        try {
            let sql = `SELECT * FROM product WHERE id=$1 `;
            let params = [id];
            let result = await client.query(sql, params);
            if (result.rows.length === 0) {
                throw "id 不存在！";
            }
            sql = `UPDATE product 
            SET no=$1, name=$2, unit=$3, price=$4, remark=$5, barcode=$6, category=$7 
            WHERE id=$8;`;
            params = [
                body.no,
                body.name,
                body.unit,
                body.price,
                body.remark,
                body.barcode,
                body.category,
                id
            ];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Put;
