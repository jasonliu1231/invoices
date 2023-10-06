$(async function () {
    const today = new Date();
    const due = getDate(today);
    const start = getDate(new Date(today.setDate(today.getDate() - 7)));
    $("#start").val(start);
    $("#due").val(due);

    searchInvoice();
});

async function searchInvoice() {
    const s = $("#start").val().replaceAll("-", "");
    const d = $("#due").val().replaceAll("-", "");
    const type = $("input[name='type']:checked").val();

    const config = apiConfig("GET");
    const response = await fetch(
        `/get/invoice?start=${s}&due=${d}&type=${type}`,
        config
    );
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
        return;
    } else {
        const data = await response.json();
        let html = "";
        data.forEach((item) => {
            html += `<tr onclick="invoiceByInum(this)">
                        <td><div class="inum text-primary">${
                            item.inum
                        }</div></td>
                        <td>${dateTransition(item.date)}</td>
                        <td>${stateTransition(item.state)}</td>
                        <td>${item.totalamount - item.taxamount}</td>
                        <td>${item.taxamount}</td>
                        <td>${item.name}</td>
                    </tr>`;
        });
        $("#invoiceList").html(html);
    }
}

async function invoiceByInum(e) {
    let inum = $("#invoiceNumber").val() || null;
    if (!inum) {
        inum = $(e).find(".inum").html();
    }

    if (!inum) {
        alertBox("warning", "發票搜尋欄位不可以空白");
        return;
    }

    const config = apiConfig("GET");
    const response = await fetch(`/get/invoice/${inum}`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
        return;
    } else {
        const data = await response.json();
        const main = data.invoiceMain;
        const details = data.invoiceDetails;
        $("#invoiceid").val(main.id);
        $("#inum").html(main.inum);
        $("#randomnumber").html(main.randomnumber);
        $("#date").html(dateTransition(main.date));
        $("#cnoteamount").html(main.cnoteamount);
        $("#taxtype").html(taxTypeTransition(main.taxtype));
        $("#taxamount").html(main.taxamount);
        $("#totalamount").html(main.totalamount);
        $("#isprint").html(main.isprint ? "已列印" : "未列印");
        let html = "";
        details.forEach((item) => {
            html += `<ul class="list-group list-group-horizontal mb-1">
                        <li class="list-group-item w-100">${item.productname}</li>
                        <li class="list-group-item w-100">${item.quantity}</li>
                        <li class="list-group-item w-100">${item.unitprice}</li>
                        <li class="list-group-item w-100">${item.unit}</li>
                    </ul>`;
        });
        $("#invoiceDetails").html(html);
        $("#invoiceMain").click();
    }
}

function hrefVoid() {
    const token = localStorage.getItem("token");
    const inum = $("#inum").html();
    const cnoteamount = $("#cnoteamount").html();
    if (cnoteamount != 0) {
        alertBox("warning", "有折讓的發票不可以作廢！");
        return;
    }
    location.href = `/voidinvoice/${token}?inum=${inum}`
}

function hrefCnote() {
    const token = localStorage.getItem("token");
    const inum = $("#inum").html();
    location.href = `/cnote/${token}?inum=${inum}`
}

function printInvoice() {
    const token = localStorage.getItem("token");
    const id = $("#invoiceid").val();
    window.open(`/printpdf/${token}?id=${id}&statement=true&type=0`);
}