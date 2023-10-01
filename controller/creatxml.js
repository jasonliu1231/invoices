const fs = require("fs");
const Get = require("./get.js");
const get = new Get();
class Create {
    async E0402(client, id) {
        let today = new Date();
        let date = new Date();
        date.setMonth(today.getMonth() - 2);
        let year = today.getFullYear() - 1911,
            max = year * 100 + today.getMonth() + 1;
        year = date.getFullYear() - 1911;
        let min = year * 100 + date.getMonth() + 1; // getMonth() 月份是 0~11 所以多+1
        let trackinfo = await get.trackinfo(client, id, min, max);

        for (let i = 0; i < trackinfo.length; i++) {
            let track = trackinfo[i];
            if (track.usedno < track.endno || track.usedno == null) {
                let E0402_xml = `<?xml version="1.0" encoding="UTF-8"?>
                    <BranchTrackBlank xmlns="urn:GEINV:eInvoiceMessage:E0402:3.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:GEINV:eInvoiceMessage:E0402:3.2 E0402.xsd">
                    <Main>
                        <HeadBan>${track.unum}</HeadBan>
                        <BranchBan>${track.unum}</BranchBan>
                        <InvoiceType>${track.type}</InvoiceType>
                        <YearMonth>${track.yearmonth}</YearMonth>
                        <InvoiceTrack>${track.tnum}</InvoiceTrack>
                    </Main>
                    <Details>
                        <BranchTrackBlankItem>
                            <InvoiceBeginNo>${
                                track.usedno
                                    ? (track.usedno + 1)
                                          .toString()
                                          .padStart(8, "0")
                                    : track.beginno.toString().padStart(8, "0")
                            }</InvoiceBeginNo>
                            <InvoiceEndNo>${track.endno
                                .toString()
                                .padStart(8, "0")}</InvoiceEndNo>
                        </BranchTrackBlankItem>
                    </Details>
                    </BranchTrackBlank>
                `;
                let url = `${
                    process.env.turnkey_upCast
                }/B2PMESSAGE/ERPOutbox/E0402-${track.unum}-${
                    track.tnum + track.endno
                }.xml`;
                fs.writeFileSync(url, E0402_xml, function (err) {
                    if (err) throw err;
                });
            }
            let sql = `UPDATE "TrackNumber" SET disabled=true WHERE id=$1;`;
            let params = [track.id];
            await client.query(sql, params);
        }
        return `資料已全部上傳完成，共上傳 ${trackinfo.length} 筆資料`;
    }

    // 開立發票XML(C0401)，獨立出來修改全欄位註記
    async C0401(XMLInfo) {
        const invoiceMain = XMLInfo.invoiceMain;
        const invoiceDetails = XMLInfo.invoiceDetails;
        const seller = XMLInfo.seller;

        let C0401_xml = `<?xml version="1.0" encoding="UTF-8"?>`;
        // 注意版本要是 3.2 版，如果改版要修改版本號
        C0401_xml += `<Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:GEINV:eInvoiceMessage:C0401:3.2 C0401.xsd">`;
        // Main 主體
        C0401_xml += `<Main>`;
        C0401_xml += `<InvoiceNumber>${invoiceMain.inum}</InvoiceNumber>`; // 發票號碼，必填
        C0401_xml += `<InvoiceDate>${invoiceMain.date}</InvoiceDate>`; // 發票日期，必填
        C0401_xml += `<InvoiceTime>${invoiceMain.time}</InvoiceTime>`; // 發票時間，必填
        // 賣方資訊
        C0401_xml += `<Seller>`;
        C0401_xml += `<Identifier>${seller.unum}</Identifier>`; // 統一編號，必填
        C0401_xml += `<Name>${seller.name}</Name>`; // 名稱，必填
        if (seller.companyaddress) {
            C0401_xml += `<Address>${
                seller.companyaddress.split("/")[1]
            }</Address>`; // 地址，選填
        }
        if (seller.personincharge) {
            C0401_xml += `<PersonInCharge>${seller.personincharge}</PersonInCharge>`; // 負責人名稱，選填
        }
        if (seller.tel) {
            C0401_xml += `<TelephoneNumber>${seller.tel}</TelephoneNumber>`; // 電話號碼，選填
        }
        if (seller.facsimilenumber) {
            C0401_xml += `<FacsimileNumber>${seller.facsimilenumber}</FacsimileNumber>`; // 傳真號碼，選填
        }
        if (seller.email) {
            C0401_xml += `<EmailAddress>${seller.email}</EmailAddress>`; // 電子郵件，選填
        }
        if (seller.customernumber) {
            C0401_xml += `<CustomerNumber>${seller.customernumber}</CustomerNumber>`; // 客戶編號，選填
        }
        if (seller.roleremark) {
            C0401_xml += `<RoleRemark>${seller.roleremark}</RoleRemark>`; // 營業人角色註記，選填
        }
        C0401_xml += `</Seller>`;

        // 買方資訊
        C0401_xml += `<Buyer>`;
        C0401_xml += `<Identifier>${invoiceMain.buyerunum ? invoiceMain.buyerunum : '0000000000'}</Identifier>`; // 統一編號，必填
        C0401_xml += `<Name>${invoiceMain.buyername ? invoiceMain.buyername : '0000'}</Name>`; // 名稱，必填
        if (invoiceMain.buyeraddr) {
            C0401_xml += `<Address>${invoiceMain.buyeraddr}</Address>`; // 地址，選填
        }
        if (invoiceMain.personincharge) {
            C0401_xml += `<PersonInCharge>${invoiceMain.personincharge}</PersonInCharge>`; // 負責人名稱，選填
        }
        if (invoiceMain.buyertel) {
            C0401_xml += `<TelephoneNumber>${invoiceMain.buyertel}</TelephoneNumber>`; // 電話號碼，選填
        }
        if (invoiceMain.facsimilenumber) {
            C0401_xml += `<FacsimileNumber>${invoiceMain.facsimilenumber}</FacsimileNumber>`; // 傳真號碼，選填
        }
        if (invoiceMain.buyermail) {
            C0401_xml += `<EmailAddress>${invoiceMain.buyermail}</EmailAddress>`; // 電子郵件，選填
        }
        if (invoiceMain.buyernumber) {
            C0401_xml += `<CustomerNumber>${invoiceMain.buyernumber}</CustomerNumber>`; // 客戶編號，選填
        }
        if (invoiceMain.roleremark) {
            C0401_xml += `<RoleRemark>${invoiceMain.roleremark}</RoleRemark>`; // 營業人角色註記，選填
        }
        C0401_xml += `</Buyer>`;
        // 發票檢查碼，選填
        // 若提供買受人電子發票證明聯，則不可傳此欄位。若實際提供傳統發票而非提供電子發票明聯，則限填”P”
        if (invoiceMain.CheckNumber) {
            C0401_xml += `<CheckNumber>${invoiceMain.CheckNumber}</CheckNumber>`;
        }
        // 買受人註記欄列表，選填
        // 1:得抵扣之進貨及費用 2:得抵扣之固定資產 3:不得抵扣之進貨及費用 4:不得抵扣之固定資產
        if (invoiceMain.BuyerRemark) {
            C0401_xml += `<BuyerRemark>${invoiceMain.BuyerRemark}</BuyerRemark>`;
        }
        // 總備註，選填
        // 一、本欄位應依稅法或其他規定填列應載明事項 二、填列衛生福利部食品追溯追蹤管理資訊系統「產品追溯系統串接碼」，本欄請填:{FDA}，含前後半型括號2碼及大寫半型英文字3碼，並於商品項目資料之單一欄位備註填列「產品追溯系統串接碼」
        if (invoiceMain.mainremark) {
            C0401_xml += `<MainRemark>${invoiceMain.mainremark}</MainRemark>`;
        }
        // 通關方式註記，選填。若為零稅率發票，此為必填欄位
        if (invoiceMain.clearancemark) {
            C0401_xml += `<CustomsClearanceMark>${invoiceMain.clearancemark}</CustomsClearanceMark>`;
        }
        if (invoiceMain.Category) {
            C0401_xml += `<Category>${invoiceMain.Category}</Category>`; // 沖帳別，選填。
        }
        if (invoiceMain.relatenumber) {
            C0401_xml += `<RelateNumber>${invoiceMain.relatenumber}</RelateNumber> `; // 相關號碼，選填。
        }
        C0401_xml += `<InvoiceType>${invoiceMain.tracknumbertype}</InvoiceType>`; // 發票類別，必填
        if (invoiceMain.groupmark) {
            C0401_xml += `<GroupMark>${invoiceMain.groupmark}</GroupMark>`; // 彙開註記，選填。
        }
        C0401_xml += `<DonateMark>${invoiceMain.donatemark}</DonateMark>`; // 捐贈註記，必填
        // 使用載具就要填寫顯碼、隱碼欄位不可分割
        if (invoiceMain.carriertype && invoiceMain.carriertype != "mb0003") {
            C0401_xml += `<CarrierType>${invoiceMain.carriertype}</CarrierType>`; // 載具類別號碼，選填。
            C0401_xml += `<CarrierId1>${invoiceMain.carrierid1}</CarrierId1>`; // 載具顯碼 id，選填。
            C0401_xml += `<CarrierId2>${invoiceMain.carrierid2}</CarrierId2>`; // 載具隱碼 id，選填。
        }
        C0401_xml += `<PrintMark>${invoiceMain.printmark}</PrintMark>`; // 電子發票證明聯已列印註記，必填
        if (invoiceMain.donatemark == "1") {
            // 發票捐贈對象，選填。如果為捐贈發票則為必填。
            C0401_xml += `<NPOBAN>${invoiceMain.npoban}</NPOBAN>`;
        }
        C0401_xml += `<RandomNumber>${invoiceMain.randomnumber}</RandomNumber>`; // 發票防偽隨機碼，必填
        C0401_xml += `</Main>`;

        // 商品 Details
        C0401_xml += `<Details>`;
        for (let i = 0; i < invoiceDetails.length; i++) {
            const detail = invoiceDetails[i];
            // 每個品項紀錄成一個 ProductItem
            C0401_xml += `<ProductItem>`;
            C0401_xml += `<Description>${detail.productname}</Description>`; // 品名，必填
            C0401_xml += `<Quantity>${detail.quantity}</Quantity>`; // 數量，必填
            if (detail.unit) {
                C0401_xml += `<Unit>${detail.unit}</Unit>`; // 單位，選填
            }
            C0401_xml += `<UnitPrice>${detail.unitprice}</UnitPrice>`; // 單價，必填
            C0401_xml += `<Amount>${detail.amount}</Amount>`; // 金額，必填
            C0401_xml += `<SequenceNumber>${(i + 1)
                .toString()
                .padStart(3, 0)}</SequenceNumber>`; // 明細排列序號，必填
            if (detail.remark) {
                C0401_xml += `<Remark>${detail.remark}</Remark>`; // 單一欄位備註，選填
            }
            /*
            相關號碼，選填
            一、商品條碼填列方式:{編碼類別代號及 商品編碼}，編碼類別代號如下:
            (一) A:國際商品編碼 (二) Z:其他商品編碼 (包含店內碼) 二、範例:
            (一) 商品編碼為「國際商品編碼」 4710110228954，則上 傳資訊為 {A4710110228954} (二) 商品編碼為「其他商品編碼(包含店 內碼)」 2602970677234，則上傳資訊為 {Z2602970677234}
            */
            if (detail.RelateNumber) {
                C0401_xml += `<RelateNumber>${detail.RelateNumber}</RelateNumber>`;
            }

            C0401_xml += `</ProductItem>`;
        }
        C0401_xml += `</Details>`;

        // 合計 Amount
        C0401_xml += `<Amount>`;
        C0401_xml += `<SalesAmount>${
            invoiceMain.buyerunum
                ? invoiceMain.totalamount
                : invoiceMain.salesamount
        }</SalesAmount>`; // 應稅銷售額合計，必填
        C0401_xml += `<FreeTaxSalesAmount>${invoiceMain.freetaxsalesamount}</FreeTaxSalesAmount>`; // 免稅銷售額合計，必填
        C0401_xml += `<ZeroTaxSalesAmount>${invoiceMain.zerotaxsalesamount}</ZeroTaxSalesAmount>`; // 零稅率銷售額合計，必填
        C0401_xml += `<TaxType>${invoiceMain.taxtype}</TaxType>`; // 課稅別，必填
        C0401_xml += `<TaxRate>${invoiceMain.taxrate}</TaxRate>`; // 稅率，必填
        C0401_xml += `<TaxAmount>${
            invoiceMain.buyerunum ? "0" : invoiceMain.taxamount
        }</TaxAmount>`; // 營業稅額，必填
        C0401_xml += `<TotalAmount>${invoiceMain.totalamount}</TotalAmount>`; // 總計，必填
        // 以下皆提供營業人備註使用，因為目前沒用到都先不要
        if (invoiceMain.DiscountAmount) {
            C0401_xml += `<DiscountAmount>${invoiceMain.DiscountAmount}</DiscountAmount>`; // 折扣金額，選填
        }
        if (invoiceMain.OriginalCurrencyAmount) {
            C0401_xml += `<OriginalCurrencyAmount>${invoiceMain.OriginalCurrencyAmount}</OriginalCurrencyAmount>`; // 原幣金額，選填
        }
        if (invoiceMain.ExchangeRate) {
            C0401_xml += `<ExchangeRate>${invoiceMain.ExchangeRate}</ExchangeRate>`; // 匯率，選填
        }
        if (invoiceMain.Currency) {
            C0401_xml += `<Currency>${invoiceMain.Currency}</Currency>`; // 幣別，選填
        }
        C0401_xml += `</Amount>`;

        C0401_xml += `</Invoice>`;
        // const url = `${process.env.turnkey_upCast}/B2CSTORAGE/ERPOutbox/C0401-${invoiceMain.date}-${invoiceMain.inum}.xml`;

        // fs.writeFileSync(url, C0401_xml, function (err) {
        //     if (err) throw err;
        // });
        return C0401_xml;
    }

    // 開立折讓單XML(D0401)，獨立出來修改全欄位註記
    async D0401(client, sellerid, id) {
        // 取得xml需要的欄位
        await client.query("BEGIN");
        let sql = `SELECT c.cnum, c.date, c.side, c.totalamount, c.taxamount,
                    CASE WHEN i.buyerunum IS NULL THEN '0000000000' ELSE i.buyerunum END buyerunum , 
                    CASE WHEN i.buyername IS NULL THEN randomnum() ELSE i.buyername END buyername, 
                    i.buyertel, i.buyermail, i.buyeraddr
                FROM "Cnote" c LEFT JOIN "Invoice" i ON i.id=c.invoiceid WHERE c.sellerid=$1 AND c.id=$2`;
        let params = [sellerid, id];
        const m = await client.query(sql, params);
        sql = `SELECT cd.invoiceindex, cd.unitprice, cd.quantity, cd.taxamount,
                    i.date, i.inum, id.index, id.productname, id.taxtype, id.unit,
                    (cd.unitprice * cd.quantity - cd.taxamount) amount
                FROM "Cnotedetail" cd
                LEFT JOIN "Cnote" c ON c.id=cd.cnoteid
                LEFT JOIN "Invoice" i ON i.id=c.invoiceid
                LEFT JOIN "Invoicedetail" id ON c.invoiceid=id.invoiceid AND cd.invoiceindex=id.index 
                WHERE cd.cnoteid=$1`;
        params = [id];
        const d = await client.query(sql, params);
        sql = `SELECT unum, name, personincharge, companyaddress, tel, facsimilenumber, email, roleremark
            FROM seller WHERE id=$1`;
        params = [sellerid];
        const s = await client.query(sql, params);
        await client.query("COMMIT");

        const main = m.rows[0],
            seller = s.rows[0];
        let D0401_xml = `<?xml version="1.0" encoding="UTF-8"?>`;
        // 注意版本要是 3.2 版，如果改版要修改版本號
        D0401_xml += `<Allowance xsi:schemaLocation="urn:GEINV:eInvoiceMessage:D0401:3.2 D0401.xsd" xmlns="urn:GEINV:eInvoiceMessage:D0401:3.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`;
        // Main 主體
        D0401_xml += `<Main>`;
        D0401_xml += `<AllowanceNumber>${main.cnum}</AllowanceNumber>`;
        D0401_xml += `<AllowanceDate>${main.date}</AllowanceDate>`;
        // 賣方資訊
        D0401_xml += `<Seller>`;
        D0401_xml += `<Identifier>${seller.unum}</Identifier>`; // 統一編號，必填
        D0401_xml += `<Name>${seller.name}</Name>`; // 名稱，必填
        if (seller.companyaddress) {
            D0401_xml += `<Address>${
                seller.companyaddress.split("/")[1]
            }</Address>`; // 地址，選填
        }
        if (seller.personincharge) {
            D0401_xml += `<PersonInCharge>${seller.personincharge}</PersonInCharge>`; // 負責人名稱，選填
        }
        if (seller.tel) {
            D0401_xml += `<TelephoneNumber>${seller.tel}</TelephoneNumber>`; // 電話號碼，選填
        }
        if (seller.facsimilenumber) {
            D0401_xml += `<FacsimileNumber>${seller.facsimilenumber}</FacsimileNumber>`; // 傳真號碼，選填
        }
        if (seller.email) {
            D0401_xml += `<EmailAddress>${seller.email}</EmailAddress>`; // 電子郵件，選填
        }
        if (seller.customernumber) {
            D0401_xml += `<CustomerNumber>${seller.customernumber}</CustomerNumber>`; // 客戶編號，選填
        }
        D0401_xml += `</Seller>`;
        // 買方資訊
        D0401_xml += `<Buyer>`;
        D0401_xml += `<Identifier>${main.buyerunum}</Identifier>`; // 統一編號，必填
        D0401_xml += `<Name>${main.buyername}</Name>`; // 名稱，必填
        if (main.buyeraddr) {
            D0401_xml += `<Address>${main.buyeraddr}</Address>`; // 地址，選填
        }
        if (main.personincharge) {
            D0401_xml += `<PersonInCharge>${main.personincharge}</PersonInCharge>`; // 負責人名稱，選填
        }
        if (main.buyertel) {
            D0401_xml += `<TelephoneNumber>${main.buyertel}</TelephoneNumber>`; // 電話號碼，選填
        }
        if (main.facsimilenumber) {
            D0401_xml += `<FacsimileNumber>${main.facsimilenumber}</FacsimileNumber>`; // 傳真號碼，選填
        }
        if (main.buyermail) {
            D0401_xml += `<EmailAddress>${main.buyermail}</EmailAddress>`; // 電子郵件，選填
        }
        if (main.buyernumber) {
            D0401_xml += `<CustomerNumber>${main.buyernumber}</CustomerNumber>`; // 客戶編號，選填
        }
        D0401_xml += `</Buyer>`;
        // 折讓種類，必填。 1:買方開立折讓證明單 2:賣方折讓證明通知單
        D0401_xml += `<AllowanceType>${main.side}</AllowanceType>`;
        if (main.Attachment) {
            D0401_xml += `<Attachment>${main.Attachment}</Attachment>`; // 證明附件，選填
        }

        D0401_xml += `</Main>`;

        // 商品 Details
        D0401_xml += `<Details>`;
        for (let i = 0; i < d.rows.length; i++) {
            const detail = d.rows[i];
            D0401_xml += `<ProductItem>`;
            D0401_xml += `<OriginalInvoiceDate>${detail.date}</OriginalInvoiceDate>`; // 原發票日期，必填
            D0401_xml += `<OriginalInvoiceNumber>${detail.inum}</OriginalInvoiceNumber>`; // 原發票號碼，必填
            if (detail.invoiceindex) {
                D0401_xml += `<OriginalSequenceNumber>${detail.invoiceindex}</OriginalSequenceNumber>`; // 原明細排列序號，選填
            }

            D0401_xml += `<OriginalDescription>${detail.productname}</OriginalDescription>`; // 原品名，必填
            D0401_xml += `<Quantity>${detail.quantity}</Quantity>`; // 數量，必填
            if (detail.unit) {
                D0401_xml += `<Unit>${detail.unit}</Unit>`; // 單位，選填
            }
            D0401_xml += `<UnitPrice>${detail.unitprice}</UnitPrice>`; // 單價，必填
            D0401_xml += `<Amount>${detail.amount}</Amount>`; // 金額(不含稅之進貨額)，必填
            D0401_xml += `<Tax>${detail.taxamount}</Tax>`; // 營業稅額，必填
            D0401_xml += `<AllowanceSequenceNumber>${detail.index}</AllowanceSequenceNumber>`; // 折讓證明單明細排列序號，必填
            D0401_xml += `<TaxType>${detail.taxtype}</TaxType>`; // 課稅別，必填
            D0401_xml += `</ProductItem>`;
        }
        D0401_xml += `</Details>`;

        // 合計 Amount
        D0401_xml += `<Amount>`;
        D0401_xml += `<TaxAmount>${main.taxamount}</TaxAmount>`; // 營業稅額合計，必填
        D0401_xml += `<TotalAmount>${main.totalamount}</TotalAmount>`; // 金額合計(不含稅之進貨額合計)，必填
        D0401_xml += `</Amount>`;

        D0401_xml += `</Allowance>`;

        const url = `${process.env.turnkey_upCast}/B2CSTORAGE/ERPOutbox/D0401-${main.date}-${main.cnum}.xml`;

        fs.writeFileSync(url, D0401_xml, function (err) {
            if (err) throw err;
        });
    }

    // 作廢發票(C0501)，獨立出來修改全欄位註記
    async C0501(client, id) {
        // 取得xml需要的欄位
        const sql = `SELECT i.inum, i.date, CASE WHEN i.buyerunum IS NULL THEN '0000000000' ELSE i.buyerunum END buyerunum, s.unum, i.voiddate, i.voidtime, i.voidreason, i.voiddnum, i.voidremark FROM "Invoice" i
            LEFT JOIN seller s ON i.sellerid=s.id WHERE i.id=$1`;
        const params = [id];
        const result = await client.query(sql, params);
        const voidinvoice = result.rows[0];
        let C0501_xml = `<?xml version="1.0" encoding="UTF-8"?>`;
        C0501_xml += `<CancelInvoice xsi:schemaLocation="urn:GEINV:eInvoiceMessage:C0501:3.2 C0501.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:GEINV:eInvoiceMessage:C0501:3.2">`;
        C0501_xml += `<CancelInvoiceNumber>${voidinvoice.inum}</CancelInvoiceNumber>`; // 作廢發票號碼，必填
        C0501_xml += `<InvoiceDate>${voidinvoice.date}</InvoiceDate>`; // 發票日期，必填
        C0501_xml += `<BuyerId>${voidinvoice.buyerunum}</BuyerId>`; // 買方統一編號，必填
        C0501_xml += `<SellerId>${voidinvoice.unum}</SellerId>`; // 賣方統一編號，必填
        C0501_xml += `<CancelDate>${voidinvoice.voiddate}</CancelDate>`; // 作廢日期，必填
        C0501_xml += `<CancelTime>${voidinvoice.voidtime}</CancelTime>`; // 作廢時間，必填
        C0501_xml += `<CancelReason>${voidinvoice.voidreason}</CancelReason>`; // 作廢原因，必填
        if (voidinvoice.documentnumber) {
            C0501_xml += `<ReturnTaxDocumentNumber>${voidinvoice.voiddnum}</ReturnTaxDocumentNumber>`; // 專案作廢核准文號，選填
        }
        if (voidinvoice.remark) {
            C0501_xml += `<Remark>${voidinvoice.voidremark}</Remark>`; // 備註，選填
        }
        C0501_xml += `</CancelInvoice>`;

        const url = `${process.env.turnkey_upCast}/B2CSTORAGE/ERPOutbox/C0501-${voidinvoice.voiddate}-${voidinvoice.inum}.xml`;

        fs.writeFileSync(url, C0501_xml, function (err) {
            if (err) throw err;
        });
    }

    // 作廢折讓單(D0501)，獨立出來修改全欄位註記
    async D0501(client, id) {
        // 取得xml需要的欄位
        const sql = `SELECT c.cnum, c.date, CASE WHEN i.buyerunum IS NULL THEN '0000000000' ELSE i.buyerunum END buyerunum, s.unum, c.voiddate, c.voidtime, c.voidreason, c.voidremark FROM "Cnote" c
            LEFT JOIN "Invoice" i ON c.invoiceid=i.id
            LEFT JOIN seller s ON i.sellerid=s.id WHERE c.id=$1`;
        const params = [id];
        const result = await client.query(sql, params);

        const voidcnote = result.rows[0];
        let D0501_xml = `<?xml version="1.0" encoding="UTF-8"?>`;
        D0501_xml += `<CancelAllowance xsi:schemaLocation="urn:GEINV:eInvoiceMessage:D0501:3.2 D0501.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:GEINV:eInvoiceMessage:D0501:3.2">`;
        D0501_xml += `<CancelAllowanceNumber>${voidcnote.cnum}</CancelAllowanceNumber>`; // 作廢折讓證明單號碼，必填
        D0501_xml += `<AllowanceDate>${voidcnote.date}</AllowanceDate>`; // 折讓證明單日期，必填
        D0501_xml += `<BuyerId>${voidcnote.buyerunum}</BuyerId>`; // 買方統一編號，必填
        D0501_xml += `<SellerId>${voidcnote.unum}</SellerId>`; // 賣方統一編號，必填
        D0501_xml += `<CancelDate>${voidcnote.voiddate}</CancelDate>`; // 折讓證明單作廢日期，必填
        D0501_xml += `<CancelTime>${voidcnote.voidtime}</CancelTime>`; // 折讓證明單作廢時間，必填
        D0501_xml += `<CancelReason>${voidcnote.voidreason}</CancelReason>`; // 折讓證明單作廢原因，必填
        if (voidcnote.remark) {
            D0501_xml += `<Remark>${voidcnote.voidremark}</Remark>`; // 備註，選填
        }
        D0501_xml += `</CancelAllowance>`;

        const url = `${process.env.turnkey_upCast}/B2CSTORAGE/ERPOutbox/D0501-${voidcnote.date}-${voidcnote.cnum}.xml`;

        fs.writeFileSync(url, D0501_xml, function (err) {
            if (err) throw err;
        });
    }

    // 註銷發票(C0701)
    async C0701(client, id) {
        let C0701_xml = `<?xml version="1.0" encoding="UTF-8"?>`;
        C0701_xml += `<VoidInvoice xmlns="urn:GEINV:eInvoiceMessage:C0701:3.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:GEINV:eInvoiceMessage:C0701:3.2 C0701.xsd">`;
        C0701_xml += `<VoidInvoiceNumber></VoidInvoiceNumber>`; // 註銷發票號碼，必填
        C0701_xml += `<InvoiceDate>${voidcnote.date}</InvoiceDate>`; // 發票日期，必填
        C0701_xml += `<BuyerId>${voidcnote.buyerunum}</BuyerId>`; // 買方統一編號，必填
        C0701_xml += `<SellerId>${voidcnote.unum}</SellerId>`; // 賣方統一編號，必填
        C0701_xml += `<VoidDate>${voidcnote.voiddate}</VoidDate>`; // 註銷日期，必填
        C0701_xml += `<VoidTime>${voidcnote.voidtime}</VoidTime>`; // 註銷時間，必填
        C0701_xml += `<VoidReason>${voidcnote.voidreason}</VoidReason>`; // 註銷原因，必填
        if (voidcnote.remark) {
            C0701_xml += `<Remark>${voidcnote.voidremark}</Remark>`; // 備註，選填
        }
        C0701_xml += `</VoidInvoice>`;

        const url = `${process.env.turnkey_upCast}/B2CSTORAGE/ERPOutbox/C0701-${voidcnote.date}-${voidcnote.cnum}.xml`;

        fs.writeFileSync(url, C0701_xml, function (err) {
            if (err) throw err;
        });
    }

    // 媒體申報黨
    async mediafile(client, sellerid, startdate, enddate) {
        await client.query("BEGIN");
        let sql = `SELECT inum, date, taxtype, totalamount, taxamount, (totalamount-taxamount) salesamount, clearancemark, groupmark, buyerunum, voiddate
                    FROM "Invoice" WHERE sellerid=$1 AND (to_date(date, 'YYYYMMDD')<=$2 AND to_date(date, 'YYYYMMDD')>=$3) ORDER BY inum`;
        let params = [sellerid, enddate, startdate];
        const m = await client.query(sql, params);

        sql = `SELECT unum, taxid FROM seller WHERE id=$1`;
        params = [sellerid];
        const s = await client.query(sql, params);
        await client.query("COMMIT");

        if (m.rows.length < 1) {
            return false;
        }
        let str = "";
        for (let i = 0; i < m.rows.length; i++) {
            let item = m.rows[i];
            let d = Number(item.date.substr(0, 6)) - 191100;
            str += `35${s.rows[0].taxid}${(i + 1)
                .toString()
                .padStart(7, 0)}${d.toString()}${
                item.voiddate
                    ? "        "
                    : item.buyerunum
                    ? item.buyerunum
                    : "        "
            }${s.rows[0].unum}${item.inum}${
                item.voiddate
                    ? "000000000000"
                    : item.buyerunum
                    ? item.salesamount.toString().padStart(12, 0)
                    : item.totalamount.toString().padStart(12, 0)
            }${item.voiddate ? "F" : item.taxtype}${
                item.voiddate
                    ? "0000000000"
                    : item.buyerunum
                    ? item.taxamount.toString().padStart(10, 0)
                    : "0000000000"
            }\n`;
        }

        fs.writeFileSync(`./public/${s.rows[0].unum}.txt`, str, function (err) {
            if (err) throw err;
        });

        return s.rows[0].unum;
    }
}

module.exports = Create;
