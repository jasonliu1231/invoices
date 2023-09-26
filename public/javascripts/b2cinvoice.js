$(async function () {
    searchProduct();
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
    $("#date").val(today);
});

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
        const nameAndUnit = $(item).find(".nameAndUnit");
        if (nameAndUnit.html() === `${name.html()}/${unit.html()}`) {
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
        <td class="nameAndUnit w-50">${name.html()}/${unit.html()}</td>
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
    if (taxType === "1") {
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
    if (taxType === "1") {
        $("#taxRate").val(0.05);
    } else if (taxType === "2") {
        $("#taxRate").val(0);
    } else if (taxType === "3") {
        $("#taxRate").val(0);
    }
    // 每次選取都會觸發計算
    setTotalAmount();
}
