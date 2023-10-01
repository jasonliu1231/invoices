$(async function () {
    searchProduct();
    setDateToday();
});

async function setDateToday() {
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
    $("#invoiceDate").val(today);

    const userid = localStorage.getItem("id");
    // 取得發票最後時間
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        }
    };

    const response = await fetch("/get/invoiceLastDate", config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        const data = await response.text();
        if (data != "") {
            let date = new Date(data);
            $("#invoiceDate").attr(
                "min",
                `${date.getFullYear()}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, 0)}-${date
                    .getDate()
                    .toString()
                    .padStart(2, 0)}`
            );
        }
    }
}

// selectproduct 在產品頁面有同名的函數，但行為不同
async function selectproduct(id, e) {
    $("#modalClose").click();
    const element = $(e.target).parent();
    const name = element.find(".name");
    const unit = element.find(".unit");
    const price = element.find(".price");
    const allProductsItem = $(".productsItem");
    let isSelected = false;
    allProductsItem.each((index, item) => {
        const nameAndUnit = $(item).find("span");
        if (
            $(nameAndUnit[0]).html() === name.html() &&
            $(nameAndUnit[1]).html() === unit.html()
        ) {
            isSelected = true;
            const quantity = $(item).find(".quantity");
            quantity.val((index, val) => {
                return Number(val) + 1;
            });
            quantity.trigger("change");
        }
    });

    if (!isSelected) {
        const productsItemList = $("#productsItemList");
        let html = `<tr class="productsItem">
        <td class="nameAndUnit w-50"><span>${name.html()}</span> / <span>${unit.html()}</span></td>
        <td class="position-relative p-0"><input
            class="unitprice w-100 h-100 border-0 position-absolute ps-2" type="text"
            onchange="setAmount(this)" value="${price.html()}"></td>
        <td class="position-relative p-0"><input
            class="quantity w-100 h-100 border-0 position-absolute ps-2" type="text"
            onchange="setAmount(this)" value="1"></td>
        <td class="position-relative p-0"><input
            class="amount w-100 h-100 border-0 position-absolute ps-2" type="text" disabled
            onchange="setTotalAmount()" value="${
                Number(price.html()) * 1
            }"></td>
      </tr>`;
        productsItemList.append(html);
    }

    // 每次選取都會觸發計算
    setTotalAmount();
}

async function searchProductFromInvoice() {
    const userid = localStorage.getItem("id");
    $("#modalLabel").html("產品列表");
    $("#loadingAction").show();
    const condition = $("#productCondition").val() || null;
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        }
    };
    let url = `/get/searchproduct?condition=${condition}`;
    const response = await fetch(url, config);
    if (response.ok) {
        $("#loadingAction").hide();
        const products = await response.json();
        if (products.length === 0) {
            $("#modalTable").hide();
            $("#modalMsg").show().html("查無相關資料");
        } else {
            $("#modalMsg").hide();
            $("#modalTable").show();
            const thead = Object.keys(products[0]);
            let theadHtml = "";
            thead.forEach((column) => {
                const display = theadTransition(column);
                theadHtml += `<th scope="col" class="text-nowrap text-center" style="max-width: 70px">${display}</th>`;
            });
            $("#modalTable thead tr").html(theadHtml);
            let tbodyHtml = "";
            products.forEach((items) => {
                const tbody = Object.values(items);
                tbodyHtml += "<tr onclick='selectproduct(null, event)'>";
                tbody.forEach((val, index) => {
                    tbodyHtml += `<th class="${
                        thead[index]
                    } text-nowrap text-truncate" style="max-width: 70px" data-name=${
                        thead[index]
                    } data-toggle="tooltip" title="${
                        thead[index] === "type"
                            ? customerTypeTransition(val)
                            : val
                    }">${val ? val : ""}</th>`;
                });
                tbodyHtml += "</tr>";
            });
            $("#modalTable tbody").html(tbodyHtml);
        }
    } else {
        $("#loadingAction").hide();
        const errmsg = await response.text();
        $("#modalTable").hide();
        $("#modalMsg").show().html(errmsg);
    }
}

function setAmount(e) {
    const elemant = $(e).parents(".productsItem");
    const unitprice = elemant.find(".unitprice");
    const quantity = elemant.find(".quantity");
    const amount = elemant.find(".amount");
    if (isNaN(unitprice.val())) {
        unitprice.addClass("bg-warning");
        alertBox("warning", "單價只能填寫數字！");
        return;
    } else {
        unitprice.removeClass("bg-warning");
    }

    if (isNaN(quantity.val())) {
        quantity.addClass("bg-warning");
        alertBox("warning", "數量只能填寫數字！");
        return;
    } else {
        quantity.removeClass("bg-warning");
    }

    if (quantity.val() < 0) {
        quantity.addClass("bg-warning");
        alertBox("warning", "商品數量不可以為負數！");
        return;
    } else {
        quantity.removeClass("bg-warning");
    }

    let q = 1;
    if (quantity.val() > 0) {
        q = quantity.val();
    } else {
        quantity.val(q);
    }
    amount.val(unitprice.val() * q);
    amount.trigger("change"); // 使用 trigger 方法觸發 "change" 事件
}

function setTotalAmount() {
    const allAmount = $(".amount");
    const taxType = $("#taxType").val();
    const taxRate = Number($("#taxRate").val());
    // 計算總額
    let totalAmount = 0;
    allAmount.each((index, e) => {
        totalAmount += Number($(e).val());
    });
    $("#totalAmount").val(totalAmount);

    // 判斷税別
    if (taxType === "1" || taxType === "4") {
        const salesAmount = Math.round(totalAmount / (1 + taxRate));
        const taxAmount = totalAmount - salesAmount;
        $("#salesAmount").val(salesAmount);
        $("#taxAmount").val(taxAmount);
        $("#zeroTaxSalesAmount").val(0);
        $("#freeTaxSalesAmount").val(0);
    } else if (taxType === "2") {
        $("#salesAmount").val(0);
        $("#taxAmount").val(0);
        $("#zeroTaxSalesAmount").val(totalAmount);
        $("#freeTaxSalesAmount").val(0);
    } else if (taxType === "3") {
        $("#salesAmount").val(0);
        $("#taxAmount").val(0);
        $("#zeroTaxSalesAmount").val(0);
        $("#freeTaxSalesAmount").val(totalAmount);
    }
}

function setTaxRate() {
    const taxType = $("#taxType").val();
    const invoiceType = $("#invoiceType").val();
    if (
        $("#invoiceType option:selected").data("type") === "07" &&
        taxType === "4"
    ) {
        $("#taxType").val(1);
        $("#taxRate").val(0.05);
    } else if (
        $("#invoiceType option:selected").data("type") === "07" &&
        taxType != "4"
    ) {
        if (taxType === "1") {
            $("#taxRate").val(0.05);
        } else if (taxType === "2") {
            $("#taxRate").val(0);
        } else if (taxType === "3") {
            $("#taxRate").val(0);
        }
    } else {
        $("#taxType").val(4);
        $("#taxRate").val(invoiceType);
    }

    // 每次選取都會觸發計算
    setTotalAmount();
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

function getInvoice() {
    const invoiceMain = {
        invoiceDate: $("#invoiceDate").val(),
        invoiceTime: currentTime(),
        buyer: {
            id: $("#unum").val(),
            name: $("#name").val(),
            email: $("#email").val(),
            tel: $("#tel").val(),
            address: $("#address").val()
        },
        mainRemark: $("#mainRemark").val() || null,
        customsClearanceMark: $("#customsClearanceMark").val() || null,
        relateNumber: $("#relateNumber").val() || null,
        invoiceType: $("#invoiceType option:selected").data("type"),
        groupMark: $("#groupMark").is(":checked") ? "*" : null
    };

    const id = $("#id").val() || null;
    const type = $("#type").val() || null;
    const statement = $("#statement").is(":checked");
    if (type === "2") {
        // 使用載具
        const carrierid = $("#carrierid").val();
        invoiceMain.printMark = "N";
        invoiceMain.donateMark = "0";
        invoiceMain.npoban = null;
        invoiceMain.carrierId1 = carrierid;
        invoiceMain.carrierId2 = carrierid;
        $("#carrierid").removeClass("border-danger");
        if (carrierid.length === 8) {
            const regex = /^\/[0-9A-Z.+\\-]{7}$/;
            if (!regex.test(carrierid)) {
                alertBox("warning", "電話載具錯誤，由/開頭＋7位大寫英文與數字");
                $("#carrierid").addClass("border-danger");
                return null;
            } else {
                invoiceMain.carrierType = `3J0002`;
            }
        } else if (carrierid.length === 16) {
            const regex = /^[A-Z]{2}\d{14}$/;
            if (!regex.test(carrierid)) {
                alertBox(
                    "warning",
                    "自然人憑證錯誤，開頭兩位大寫英文＋14位數字"
                );
                $("#carrierid").addClass("border-danger");
                return null;
            } else {
                invoiceMain.carrierType = `CQ0001`;
            }
        } else {
            $("#carrierid").addClass("border-danger");
            alertBox("warning", "載具條碼錯誤，請再次檢查！");
            return null;
        }
    } else if (type === "3") {
        // 會員載具 TODO: 會員載具要申請
        invoiceMain.printMark = "N";
        invoiceMain.donateMark = "0";
        invoiceMain.npoban = null;
        invoiceMain.carrierType = ``; // 申請後取得的條碼
        invoiceMain.carrierId1 = ``; // 自訂義的編號
        invoiceMain.carrierId2 = ``; // 自訂義的編號
        alertBox("warning", "無申請會員條碼，無法使用此功能！");
        return null;
    } else if (type === "4") {
        // 捐贈
        invoiceMain.printMark = "N";
        invoiceMain.donateMark = "1";
        invoiceMain.npoban = $("#npoban").val() || "919";
        if (!$("#npoban").val()) {
            alertBox("warning", "無填寫捐贈碼，將捐贈給創世基金會(919)！");
        }
    } else {
        // 非會挑選買家 紙本發票 或 email
        invoiceMain.printMark = "Y";
        invoiceMain.donateMark = "0";
        invoiceMain.npoban = null;
        invoiceMain.carrierType = null;
        invoiceMain.carrierId1 = null;
        invoiceMain.carrierId2 = null;
    }

    const invoiceDetails = [];
    const productsItemList = $(".productsItem");
    if (productsItemList.length === 0) {
        alertBox("warning", "請至少選一項商品！");
        return null;
    }
    productsItemList.each((index, item) => {
        const productsItem = $(item).find("span");
        const description = $(productsItem[0]).html();
        const unit = $(productsItem[1]).html();
        const quantity = $(item).find(".quantity").val();
        const unitPrice = $(item).find(".unitprice").val();
        const amount = $(item).find(".amount").val();
        invoiceDetails.push({
            description,
            unit,
            quantity,
            unitPrice,
            amount
        });
    });

    const invoiceAmount = {
        salesAmount: $("#salesAmount").val(),
        freeTaxSalesAmount: $("#freeTaxSalesAmount").val(),
        zeroTaxSalesAmount: $("#zeroTaxSalesAmount").val(),
        taxType: $("#taxType").val(),
        taxRate: $("#taxRate").val(),
        taxAmount: $("#taxAmount").val(),
        totalAmount: $("#totalAmount").val()
    };

    if ($("#totalAmount").val() < 0) {
        alertBox("warning", "總金額不可以為負數！");
        $("#totalAmount").addClass("border-danger");
        return null;
    } else {
        $("#totalAmount").removeClass("border-danger");
    }
    return { id, type, statement, invoiceMain, invoiceDetails, invoiceAmount };
}

function clearInvoice() {
    setDateToday();
    $("#invoiceType").val(0.05);
    $("#unum").val("");
    $("#name").val("");
    $("#email").val("");
    $("#tel").val("");
    $("#address").val("");
    $("#mainRemark").val("");
    $("#customsClearanceMark").val("");
    $("#relateNumber").val("");
    $("#groupMark").prop("checked", false);
    $("#id").val("");
    $("#type").val(0);
    $("#statement").prop("checked", false);
    $("#carrierid").val("");
    $("#npoban").val("");
    $("#productsItemList").html("");
    $("#salesAmount").val("");
    $("#freeTaxSalesAmount").val("");
    $("#zeroTaxSalesAmount").val("");
    $("#taxType").val(1);
    $("#taxRate").val(0.05);
    $("#taxAmount").val("");
    $("#totalAmount").val("");
}

async function saveInvoice() {
    const invoiceInfo = getInvoice();
    if (!invoiceInfo) {
        return;
    }
    const userid = localStorage.getItem("id");
    let token = localStorage.getItem("token");
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        },
        body: JSON.stringify(invoiceInfo)
    };

    const response = await fetch("/post/invoice", config);
    if (response.ok) {
        const data = await response.json();
        alertBox("invoice", data.inum);
        clearInvoice();

        const url = `/printpdf/${token}?id=${data.id}&statement=${invoiceInfo.statement}&type=${invoiceInfo.type}`;
        if (invoiceInfo.type === "0") {
            // 列印發票
            window.open(url);
        } else if (invoiceInfo.type === "1") {
            // 發送 email
        } else {
            if (invoiceInfo.statement) {
                // 只列印明細
                window.open(url);
            }
        }
        window.open(`/xmlsample/${token}?id=${data.id}&type=C0401`);
    } else {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    }
}
