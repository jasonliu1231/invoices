class Put {
    async company(client, body) {
        try {
            const sql = `UPDATE seller 
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
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async customer(client, body, id) {
        try {
            const sql = `UPDATE customer 
                SET name=$1, unum=$2, type=$3, recipient=$4, address=$5, tel=$6, email=$7, carrierid=$8, npoban=$9, roleremark=$10, mobile=$11, memberid=$12 
                WHERE id=$13;`;
            const params = [
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
            const sql = `UPDATE product 
                SET no=$1, name=$2, unit=$3, price=$4, remark=$5, barcode=$6, category=$7 
                WHERE id=$8;`;
            const params = [
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

    async user(client, body, id) {
        try {
            let sql = `UPDATE users SET name=$1, disabled=$2 WHERE id=$3;`;
            let params = [body.name, body.type, id];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }

    async permis(client, body, id) {
        try {
            let sql = `UPDATE permis
                SET companyupdate=$1, customercreate=$2, customerupdate=$3, customerread=$4, customerdelete=$5, 
                    productscreate=$6, productsupdate=$7, productsread=$8, productsdelete=$9, 
                    invoicecreate=$10, invoiceupdate=$11, invoiceread=$12, invoicedelete=$13, 
                    userscreate=$14, usersupdate=$15, usersread=$16, usersdelete=$17
                WHERE userid=$18;`;
            let params = [
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
                body.usersdelete,
                id
            ];
            await client.query(sql, params);
        } catch (err) {
            throw "連線資料庫錯誤！原因：" + err;
        }
    }
}

module.exports = Put;
