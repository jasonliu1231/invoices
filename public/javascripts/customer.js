$(function () {
    $(".accordion-button")[0].click();
});
function getSettingVal() {
    const id = $("#id").val() || null;
    const name = $("#name").val() || null;
    const unum = $("#unum").val() || null;
    const mobile = $("#mobile").val() || null;
    const idroleremark = $("#roleremark").val() || null;
    const type = $("[name=type]:checked").val();
    const recipient = $("#recipient").val() || null;
    const tel = $("#tel").val() || null;
    const address = $("#address").val() || null;
    const email = $("#email").val() || null;
    const carrierid = $("#carrierid").val() || null;
    const npoban = $("#npoban").val() || null;
    const memberid = $("#memberid").val() || null;

    return {
        id,
        name,
        unum,
        mobile,
        idroleremark,
        type,
        recipient,
        tel,
        address,
        email,
        carrierid,
        npoban,
        memberid
    };
}

function setCustomer() {
    $("#id").val("");
    $("#name").val("");
    $("#unum").val("");
    $("#mobile").val("");
    $("#roleremark").val("");
    $(`input[value=0]`).prop("checked", true);
    $("collapseOne").addClass("show");
    $("#recipient").val("");
    $("#tel").val("");
    $("#address").val("");
    $("#email").val("");
    $("#carrierid").val("");
    $("#npoban").val("");
    $("#memberid").val("");
    $(".accordion-button")[0].click();
}

async function saveCustomer() {
    const customerInfo = getSettingVal();
    if (!customerInfo.name || !customerInfo.mobile) {
        !customerInfo.name
            ? $("#name").addClass("border-danger")
            : $("#name").removeClass("border-danger");
        !customerInfo.mobile
            ? $("#mobile").addClass("border-danger")
            : $("#mobile").removeClass("border-danger");
        alertBox("warning", "必填欄位不可空白");
        return;
    }

    let url = "";
    const userid = localStorage.getItem("id");
    if (!customerInfo.id) {
        url = `/post/customer`;
    } else {
        url = `/put/customer/${customerInfo.id}`;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        },
        body: JSON.stringify(customerInfo)
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        alertBox("success");
        setCustomer();
    }
}

async function deleteCustomer() {
    const id = $("#id").val() || null;
    if (!id || id.length != 36) {
        alertBox("warning", "刪除請填寫完整的客戶id");
        $("#id").addClass("border-danger");
        return;
    }

    const check = confirm("確定要刪除嗎？");
    const userid = localStorage.getItem("id");
    if (check) {
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                userid: userid
            }
        };
        const response = await fetch(`/delete/customer/${id}`, config);
        if (!response.ok) {
            const errmsg = await response.text();
            alertBox("error", errmsg);
            return;
        }
        alertBox("success");
        setCustomer();
    }
}

function handleCollapse() {
    const checked = $("[name=type]:checked").val();
    $(".accordion-button")[checked].click();
}
