$(function () {
    const today = getToday();
    $("#voidDate").val(today);
});

async function invoice() {
    const cnoteNumber = $("#cnoteNumber").val();
    if (!cnoteNumber) {
        $("#cnoteNumber").addClass("border-danger");
        alertBox("warning", "發票號碼不可以空白！");
        return;
    }
    const config = apiConfig("GET");
    const response = await fetch(`/get/cnote/${cnoteNumber}?type=void`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        const data = await response.json();
        $("#inum").val(data.inum);
        $("#invoiceDate").val(data.idate);
        $("#cnum").val(data.cnum);
        $("#cnoteDate").val(data.cdate);
        $("#salesAmount").val(data.totalamount - data.taxamount);
        $("#taxAmount").val(data.taxamount);
        $("#totalAmount").val(data.totalamount);
        $("#cnoteid").val(data.id);
    }
}

function clearInput() {
    $("#inum").val("");
    $("#cnum").val("");
    $("#cnoteNumber").val("");
    $("#salesAmount").val("");
    $("#taxAmount").val("");
    $("#totalAmount").val("");
    $("#reason").val("");
    $("#cnoteDate").val("");
    $("#invoiceDate").val("");
    $("#remark").val("");
    const today = getToday();
    $("#voidDate").val(today);
}

async function saveVoid() {
    const cnoteid = $("#cnoteid").val();
    const voidDate = $("#voidDate").val();
    const reason = $("#reason").val() || "資訊有誤";
    const remark = $("#remark").val() || null;
    const voidTime = currentTime();
    const config = apiConfig("POST", {
        voidDate,
        voidTime,
        reason,
        remark
    });
    const response = await fetch(`/patch/voidcnote/${cnoteid}`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        clearInput()
        alertBox("success");
        let token = localStorage.getItem("token");
        window.open(`/xmlsample/${token}?id=${cnoteid}&type=D0501`);
    }
}
