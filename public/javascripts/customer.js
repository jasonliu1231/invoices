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

async function savecustomer() {
    const customerInfo = getSettingVal();
    if (!customerInfo.name || !customerInfo.mobile) {
        !customerInfo.name
            ? $("#name").addClass("border-danger")
            : $("#name").removeClass("border-danger");
        !customerInfo.mobile
            ? $("#mobile").addClass("border-danger")
            : $("#mobile").removeClass("border-danger");
        alert("必填欄位不可空白");
        return;
    }

    let url = "";
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");
    if (!customerInfo.id) {
        url = `/post/customer/${userid}`;
    } else {
        url = `/put/customer/${userid}/${customerInfo.id}`;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customerInfo)
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alert(errmsg);
    } else {
        window.location.href = `../customer/${token}`;
    }
}

async function deletecustomer() {
    const id = $("#id").val() || null;
    if (!id || id.length != 36) {
        alert("刪除請填寫完整的客戶id");
        $("#id").addClass("border-danger");
        return;
    }

    const check = confirm("確定要刪除嗎？");
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");
    if (check) {
        const response = await fetch(`/delete/customer/${userid}/${id}`);
        if (!response.ok) {
            const errmsg = await response.text();
            alert(errmsg);
            return;
        }
        window.location.href = `../customer/${token}`;
    }
}
