$(async function () {
    const today = new Date();
    const due = getDate(today);
    const start = getDate(new Date(today.setDate(today.getDate() - 3)));
    $("#start").val(start);
    $("#due").val(due);

    searchCnote();
});

async function searchCnote() {
    const s = $("#start").val().replaceAll("-", "");
    const d = $("#due").val().replaceAll("-", "");

    const config = apiConfig("GET");
    const response = await fetch(`/get/cnote?start=${s}&due=${d}`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
        return;
    } else {
        const data = await response.json();
        let html = "";
        data.forEach((item) => {
            html += `<tr onclick="cnoteByCnum(this)">
                        <td><div class="cnum text-primary">${
                            item.cnum
                        }</div></td>
                        <td>${dateTransition(item.date)}</td>
                        <td>${stateTransition(item.state)}</td>
                        <td>${item.totalamount - item.taxamount}</td>
                        <td>${item.taxamount}</td>
                        <td>${item.name}</td>
                    </tr>`;
        });
        $("#cnoteList").html(html);
    }
}

async function cnoteByCnum(e) {
    let cnum = $("#cnoteNumber").val() || null;
    if (!cnum) {
        cnum = $(e).find(".cnum").html();
    }

    if (!cnum) {
        alertBox("warning", "搜尋欄位不可以空白");
        return;
    }

    const config = apiConfig("GET");
    const response = await fetch(`/get/cnote/${cnum}`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
        return;
    } else {
        const data = await response.json();
        $("#invoiceid").val(data.invoiceid);
        $("#cnum").html(data.cnum);
        $("#cdate").html(dateTransition(data.cdate));
        $("#inum").html(data.inum);
        $("#idate").html(dateTransition(data.idate));
        $("#cnoteamount").html(data.cnoteamount);
        $("#invoiceMain").click();
    }
}

function hrefVoid() {
    const token = localStorage.getItem("token");
    const cnum = $("#cnum").html();
    location.href = `/voidcnote/${token}?cnum=${cnum}`
}

function printInvoice() {
    const token = localStorage.getItem("token");
    const id = $("#invoiceid").val();
    window.open(`/printpdf/${token}?id=${id}`);
}
