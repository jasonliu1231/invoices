$(async function () {
    const token = localStorage.getItem("token");
    $("#userName").html("使用者：" + localStorage.getItem("name"));
    $("#companyLink").attr("href", `/company/${token}`);
    $("#productsLink").attr("href", `/products/${token}`);
    $("#customerLink").attr("href", `/customer/${token}`);
    $("#userLink").attr("href", `/user/${token}`);
    $("#logoutLink").attr("href", `/logout/${token}`);
    $("#trackLink").attr("href", `/track/${token}`);


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
        default:
            return column;
    }
}

function customerTypeTransition(val) {
    switch (val) {
        case "0":
            return "寄送紙本發票";
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

function tableTarget(e) {
    $("#modalTable tbody tr").removeClass("table-success");
    $(e).addClass("table-success");
}

function selsetItem() {
    const checked = $("#modalTable tbody .table-success").children();
    checked.each((index, item) => {
        const id = $(item).attr("data-name");
        if (id === "type") {
            const radio = $("input[name='type']");
            radio.each((index, element) => {
                $(element).val() === $(item).html() &&
                    $(element).prop("checked", true);
            });
        }
        $(`#${id}`).val($(item).html());
    });
}

async function searchCustomer(from) {
    const popoverTriggerList = document.querySelectorAll(
        '[data-bs-toggle="popover"]'
    );
    const popoverList = [...popoverTriggerList].map(
        (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );
    const userid = localStorage.getItem("id");
    $("#modalLabel").html("客戶列表");
    $("#loadingAction").show();
    const condition = $("#condition").val() || null;
    let url = `/get/customer/${userid}`;
    if (condition) {
        url += `/${from}?condition=${condition}`;
    }
    const response = await fetch(url);
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
