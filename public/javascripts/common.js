$(async function () {
    const token = localStorage.getItem("token");
    $("#userName").html("使用者：" + localStorage.getItem("name"));
    $("#companyLink").attr("href", `/company/${token}`);
    $("#productsLink").attr("href", `/products/${token}`);
    $("#customerLink").attr("href", `/customer/${token}`);
    $("#userLink").attr("href", `/user/${token}`);
    $("#logoutLink").attr("href", `/logout/${token}`);
    $("#trackLink").attr("href", `/track/${token}`);
    $("#b2cinvoiceLink").attr("href", `/b2cinvoice/${token}`);
    $("#cnoteLink").attr("href", `/cnote/${token}`);
    $("#voidcnoteLink").attr("href", `/voidcnote/${token}`);
    $("#voidinvoiceLink").attr("href", `/voidinvoice/${token}`);
    $("#serchinvoiceLink").attr("href", `/serchinvoice/${token}`);
    $("#serchconteLink").attr("href", `/serchconte/${token}`);
});

function theadTransition(column) {
    switch (column) {
        case "id":
            return "編號";
        case "name":
            return "名稱";
        case "unum":
            return "統一編號";
        case "type":
            return "種類";
        case "recipient":
            return "收件人";
        case "address":
            return "地址";
        case "tel":
            return "電話";
        case "carrierid":
            return "載具條碼";
        case "npoban":
            return "捐贈碼";
        case "roleremark":
            return "備註";
        case "mobile":
            return "手機";
        case "memberid":
            return "會員編號";
        case "unit":
            return "單位";
        case "price":
            return "單價";
        default:
            return column;
    }
}

function customerTypeTransition(val) {
    switch (val) {
        case "0":
            return "紙本發票";
        case "1":
            return "email";
        case "2":
            return "使用載具";
        case "3":
            return "會員載具";
        case "4":
            return "捐贈";
        default:
            return val;
    }
}

function taxTypeTransition(val) {
    switch (val) {
        case "1":
            return "應稅";
        case "2":
            return "零稅";
        case "3":
            return "免稅";
        case "4":
            return "應稅(特種稅率)";
        default:
            return val;
    }
}

function apiConfig(method, bodyInfo) {
    method = method.toUpperCase();
    const userid = localStorage.getItem("id");
    const config = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            userid: userid
        }
    };

    if (method === "POST") {
        config.body = JSON.stringify(bodyInfo);
    }

    return config;
}

function getToday() {
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;

    return today;
}

function tableTarget(e) {
    const checked = $(e).children();
    checked.each((index, item) => {
        const id = $(item).data("name");
        if (id === "type") {
            const radio = $("input[name='type']");
            radio.each((index, element) => {
                $(element).val() === $(item).html() &&
                    $(element).prop("checked", true);
                if ($(".accordion-button")) {
                    $(".accordion-button")[$(item).html()].click();
                }
            });
        }
        $(`#${id}`).val($(item).html());
    });
    $("#modalClose").click();
}

async function searchCustomer(from) {
    const userid = localStorage.getItem("id");
    $("#modalLabel").html("客戶列表");
    $("#loadingAction").show();
    const condition = $("#customerCondition").val() || null;
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        }
    };
    let url = `/get/customer`;
    if (condition) {
        url += `/${from}?condition=${condition}`;
    }
    const response = await fetch(url, config);
    if (response.ok) {
        $("#loadingAction").hide();
        const customers = await response.json();
        if (customers.length === 0) {
            $("#modalTable").hide();
            $("#modalMsg").show().html("查無相關資料");
        } else {
            $("#modalMsg").hide();
            $("#modalTable").show();
            const thead = Object.keys(customers[0]);
            let theadHtml = "";
            thead.forEach((column) => {
                const display = theadTransition(column);
                theadHtml += `<th scope="col" class="text-nowrap text-center" style="max-width: 70px">${display}</th>`;
            });
            $("#modalTable thead tr").html(theadHtml);
            let tbodyHtml = "";
            customers.forEach((items) => {
                const tbody = Object.values(items);
                tbodyHtml += "<tr onclick='tableTarget(this)'>";
                tbody.forEach((val, index) => {
                    tbodyHtml += `<th class="text-nowrap text-truncate" style="max-width: 70px" data-name=${
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

async function searchProduct() {
    const userid = localStorage.getItem("id");
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        }
    };
    const response = await fetch(`/get/product`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        $("#errorMsg").html(errmsg);
    }

    const data = await response.json();
    const categorys = new Set();
    data.forEach((item) => {
        categorys.add(item.category);
    });
    for (let category of categorys.keys()) {
        const option = $(`<option value="${category}"></option>`);
        const option2 = $(`<option value="${category}">${category}</option>`);
        $("#typelist").append(option);
        $("#typelist2").append(option2);
        const item = $("<div></div>");
        const collapsebtn = `<button class="btn btn-outline-secondary btn-sm my-2" type="button" data-bs-toggle="collapse"
                        data-bs-target="#${category}" aria-expanded="false" aria-controls="collapseExample">
                        ${category}
                    </button>`;
        const collapseData = $(`<div class="collapse" id="${category}"></div>`);
        const collapseCard = $(`<div class="card card-body"></div>`);
        let collapseText = "";
        data.forEach((item) => {
            if (item.category === category) {
                collapseText += `<div data-bs-dismiss="offcanvas" aria-label="Close" class="p-1" style="cursor: pointer;" onclick="selectproduct('${
                    item.id
                }', event)">
                                    <div class="d-flex collapseText">
                                        <span class="name text-nowrap text-truncate" data-toggle="tooltip" title="${
                                            item.name
                                        }" style="width: 33%;">${
                    item.name
                }</span>
                                        <span class="unit text-nowrap text-truncate" data-toggle="tooltip" title="${
                                            item.unit
                                        }" style="width: 33%;">${
                    item.unit ? item.unit : ""
                }</span>
                                        <span class="price text-nowrap text-truncate" data-toggle="tooltip" title="${
                                            item.price
                                        }" style="width: 33%;">${
                    item.price
                }</span>
                                    </div>
                                </div>`;
            }
        });
        collapseCard.append(collapseText);
        collapseData.append(collapseCard);
        item.append(collapsebtn).append(collapseData);
        $("#collapseInfo").append(item);
    }
}

function alertBox(type, msg) {
    let element = "";
    if (type === "success") {
        element = "successAlert";
    } else if (type === "error") {
        element = "errorAlert";
        $(`#${element} p`).html(msg);
    } else if (type === "warning") {
        element = "warningAlert";
        $(`#${element} p`).html(msg);
    } else if (type === "invoice") {
        element = "invoiceAlert";
        $(`#${element} p`).html(msg);
    }
    $(`#${element}`).css("top", "56px");
    if (type === "success" || type === "warning") {
        setTimeout(() => {
            $(`#${element}`).css("top", "-100%");
        }, 1500);
    }
}

function closeAlert(element) {
    $(element).parents(".alert").css("top", "-100%");
}

function currentTime() {
    const time = new Date().toLocaleTimeString([], {
        hour12: false,
        hourCycle: "h23"
    });
    return time;
}
