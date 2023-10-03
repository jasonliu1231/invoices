$(async function () {
    getCnoteNumber(new Date());
    const today = getToday();
    $("#cnoteDate").val(today);
});

async function getCnoteNumber(day) {
    const date = new Date(day);
    const today = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}${date.getDate().toString().padStart(2, 0)}`;

    const config = apiConfig("GET");
    const response = await fetch(`/get/cnotenumber?today=${today}`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        const data = await response.json();
        $("#cnoteNumber").val(
            today + (data.length + 1).toString().padStart(3, 0)
        );
    }
}

async function invoice() {
    const invoiceNumber = $("#invoiceNumber").val();
    if (!invoiceNumber) {
        $("#invoiceNumber").addClass("border-danger");
        alertBox("warning", "發票號碼不可以空白！");
        return;
    }
    const config = apiConfig("GET");
    const response = await fetch(`/get/invoice/${invoiceNumber}?type=cnote`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        const data = await response.json();
        $("#inum").val(data.invoiceMain.inum);
        $("#invoiceDate").val(data.invoiceMain.date);
        const taxRate = Number(data.invoiceMain.taxrate);
        $("#taxRate").val(taxRate);
        $("#taxType").val(taxTypeTransition(data.invoiceMain.taxtype));
        $("#invoiceid").val(data.invoiceMain.id);
        $("#cnoteAmount").val(
            data.invoiceMain.totalamount -
                data.invoiceMain.taxamount -
                data.invoiceMain.cnoteamount
        );
        const invoiceDetails = data.invoiceDetails;
        let html = "";
        for (let i = 0; i < invoiceDetails.length; i++) {
            const item = invoiceDetails[i];
            html += `
            <div class="card m-1">
                <div class="card-header">
                <div class="input-group">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" onclick="setTotalAmount()">
                    </div>
                    <span class="input-group-text" style="width: 100px;">選擇折讓</span>
                </div>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <div class="input-group mb-3">
                            <span class="input-group-text" style="width: 100px;">商品名稱</span>
                            <input type="text" class="productname form-control p-2" readonly value="${item.productname}">
                        </div>
                    </li>
                    <li class="list-group-item">
                        <div class="input-group mb-3">
                            <span class="input-group-text" style="width: 100px;">單價</span>
                            <input type="text" class="unitprice form-control p-2" value="${item.unitprice}" onchange="setTotalAmount()">
                        </div>
                    </li>
                    <li class="list-group-item">
                        <div class="input-group mb-3">
                            <span class="input-group-text" style="width: 100px;">數量</span>
                            <input type="text" class="quantity form-control p-2" value="${item.quantity}" onchange="setTotalAmount()">
                            <span class="unit input-group-text" style="width: 100px;">${item.unit}</span>
                        </div>
                    </li>
                </ul>
            </div>
            `;
        }
        $("#details").html(html);
    }
}

function detailClick(event) {
    const ischecked = $("#statement").is(":checked");
    if (event.target.tagName === "INPUT" || event.target.tagName === "LABEL") {
        event.stopPropagation();
    } else {
        if (ischecked) {
            $("#statement").prop("checked", false);
        } else {
            $("#statement").prop("checked", true);
        }
    }
}

function setTotalAmount() {
    const taxRate = Number($("#taxRate").val());
    const items = $(".card");
    let totalAmount = 0;
    items.each((index, element) => {
        const checkbox = $(element).find('input[type="checkbox"]');
        if (checkbox.is(":checked")) {
            const unitprice = $(element).find(".unitprice").val();
            const quantity = $(element).find(".quantity").val();
            totalAmount += Number(unitprice) * Number(quantity);
        }
    });
    $("#totalAmount").val(totalAmount);
    const salesAmount = Math.round(totalAmount / (1 + taxRate));
    $("#salesAmount").val(salesAmount);
    const taxAmount = totalAmount - salesAmount;
    $("#taxAmount").val(taxAmount);
}

async function saveCnote() {
    const totalAmount = Number($("#totalAmount").val());
    const salesAmount = Number($("#salesAmount").val());
    const cnoteAmount = Number($("#cnoteAmount").val());
    const invoiceid = $("#invoiceid").val();

    const main = {
        cnoteNumber: $("#cnoteNumber").val(),
        cnoteDate: $("#cnoteDate").val(),
        invoiceid: invoiceid,
        totalAmount: totalAmount,
        taxAmount: Number($("#taxAmount").val())
    };
    if (totalAmount < 0 ) {
        alertBox("warning", "總計金額不可小於0");
        return;
    } else if (salesAmount === 0) {
        alertBox("warning", "請選擇至少一項折讓商品");
        return;
    } else if (salesAmount > cnoteAmount) {
        alertBox("warning", "折讓金額不可超過折讓餘額");
        return;
    }
    const taxRate = Number($("#taxRate").val());
    const detail = [];
    const items = $(".card");
    items.each((index, element) => {
        const checkbox = $(element).find('input[type="checkbox"]');
        if (checkbox.is(":checked")) {
            const productname = $(element).find(".productname").val();
            const unitprice = $(element).find(".unitprice").val();
            const quantity = $(element).find(".quantity").val();
            const unit = $(element).find(".unit").html();
            const amount = Math.round((unitprice * quantity) / (1 + taxRate));
            const tax = unitprice * quantity - amount;
            detail.push({
                productname,
                unitprice,
                quantity,
                amount,
                tax,
                unit,
            });
        }
    });

    const config = apiConfig("POST", { main, detail });
    const response = await fetch(`/post/cnote`, config);
    let token = localStorage.getItem("token");
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        alertBox("success");
        if ($("#statement").is(":checked")) {
            window.open(`/printpdf/${token}?id=${invoiceid}`);
        }
        window.open(`/xmlsample/${token}?id=${invoiceid}&type=D0401`);
    }
}
