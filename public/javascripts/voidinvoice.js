$(function () {
    const url = new URL(location.href);
    const inum = url.searchParams.get("inum");
    $("#invoiceNumber").val(inum);
    if (inum) {
        invoice();
    }
    const today = getDate(new Date());
    $("#voidDate").val(today);
});

async function invoice() {
    const invoiceNumber = $("#invoiceNumber").val();
    if (!invoiceNumber) {
        $("#invoiceNumber").addClass("border-danger");
        alertBox("warning", "發票號碼不可以空白！");
        return;
    }
    const config = apiConfig("GET");
    const response = await fetch(
        `/get/invoice/${invoiceNumber}?type=void`,
        config
    );
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        const data = await response.json();
        const invoiceMain = data.invoiceMain;
        $("#inum").val(invoiceMain.inum);
        $("#invoiceDate").val(invoiceMain.date);
        $("#salesAmount").val(invoiceMain.totalamount - invoiceMain.taxamount);
        $("#taxAmount").val(invoiceMain.taxamount);
        $("#totalAmount").val(invoiceMain.totalamount);
        $("#invoiceid").val(invoiceMain.id);
    }
}

function clearInput() {
    $("#inum").val("");
    $("#invoiceDate").val("");
    $("#salesAmount").val("");
    $("#taxAmount").val("");
    $("#totalAmount").val("");
    $("#reason").val("");
    $("#ReturnTaxDocumentNumber").val("");
    $("#invoiceNumber").val("");
    $("#remark").val("");
    const today = getDate(new Date());
    $("#voidDate").val(today);
}

async function saveVoid() {
    const invoiceid = $("#invoiceid").val();
    const voidDate = $("#voidDate").val();
    const ReturnTaxDocumentNumber = $("#ReturnTaxDocumentNumber").val();
    const reason = $("#reason").val() || "資訊有誤";
    const remark = $("#remark").val() || null;
    const voidTime = currentTime();
    const config = apiConfig("POST", {
        voidDate,
        voidTime,
        reason,
        ReturnTaxDocumentNumber,
        remark
    });
    const response = await fetch(`/patch/voidinvoice/${invoiceid}`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        clearInput();
        alertBox("success");
        const token = localStorage.getItem("token");
        window.open(`/xmlsample/${token}?id=${invoiceid}&type=C0501`);
    }
}
