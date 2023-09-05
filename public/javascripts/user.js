$(async function () {
    const response = await fetch(`/get/user`);
    if (!response.ok) {
        const errmsg = await response.text();
        $("#errorMsg").html(errmsg);
    }

    const data = await response.json();
    data.forEach((user) => {
        const div = $(
            `<span class="p-2" onclick="selectuser('${user.id}')"></span>`
        );
        if (user.disabled === "0") {
            div.append(
                `<a href="#" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${user.name}</a>`
            );
            $("#enabledUser").append(div);
        } else {
            div.append(
                `<a href="#" class="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${user.name}</a>`
            );
            $("#disabledUser").append(div);
        }
    });
});

async function selectuser(id) {
    const response = await fetch(`/get/user/${id}`);
    if (!response.ok) {
        const errmsg = await response.text();
        alert(errmsg);
    }
    const data = await response.json();
    $("#id").val(data.id);
    $("#name").val(data.name);
    $(`input[value=${data.disabled}]`).prop("checked", true);
    data.companyupdate
        ? $("#companyupdate").prop("checked", true)
        : $("#companyupdate").prop("checked", false);
    data.customercreate
        ? $("#customercreate").prop("checked", true)
        : $("#customercreate").prop("checked", false);
    data.customerupdate
        ? $("#customerupdate").prop("checked", true)
        : $("#customerupdate").prop("checked", false);
    data.customerread
        ? $("#customerread").prop("checked", true)
        : $("#customerread").prop("checked", false);
    data.customerdelete
        ? $("#customerdelete").prop("checked", true)
        : $("#customerdelete").prop("checked", false);
    data.productscreate
        ? $("#productscreate").prop("checked", true)
        : $("#productscreate").prop("checked", false);
    data.productsupdate
        ? $("#productsupdate").prop("checked", true)
        : $("#productsupdate").prop("checked", false);
    data.productsread
        ? $("#productsread").prop("checked", true)
        : $("#productsread").prop("checked", false);
    data.productsdelete
        ? $("#productsdelete").prop("checked", true)
        : $("#productsdelete").prop("checked", false);
    data.invoicecreate
        ? $("#invoicecreate").prop("checked", true)
        : $("#invoicecreate").prop("checked", false);
    data.invoiceupdate
        ? $("#invoiceupdate").prop("checked", true)
        : $("#invoiceupdate").prop("checked", false);
    data.invoiceread
        ? $("#invoiceread").prop("checked", true)
        : $("#invoiceread").prop("checked", false);
    data.invoicedelete
        ? $("#invoicedelete").prop("checked", true)
        : $("#invoicedelete").prop("checked", false);
    data.userscreate
        ? $("#userscreate").prop("checked", true)
        : $("#userscreate").prop("checked", false);
    data.usersupdate
        ? $("#usersupdate").prop("checked", true)
        : $("#usersupdate").prop("checked", false);
    data.usersread
        ? $("#usersread").prop("checked", true)
        : $("#usersread").prop("checked", false);
    data.usersdelete
        ? $("#usersdelete").prop("checked", true)
        : $("#usersdelete").prop("checked", false);
}

function changePassword() {
    const id = $("#id").val();
    const userid = $("#loginUser").attr("data-userid");
    if (id != userid) {
        alert("非本人無法修改密碼！");
        return;
    }
    $("#newPassword").toggle();
}

function getSettingVal() {
    const id = $("#id").val() || null;
    const name = $("#name").val() || null;
    const type = $("input[name='type']:checked").val() || null;
    const companyupdate = $("#companyupdate").is(":checked");
    const customercreate = $("#customercreate").is(":checked");
    const customerupdate = $("#customerupdate").is(":checked");
    const customerread = $("#customerread").is(":checked");
    const customerdelete = $("#customerdelete").is(":checked");
    const productscreate = $("#productscreate").is(":checked");
    const productsupdate = $("#productsupdate").is(":checked");
    const productsread = $("#productsread").is(":checked");
    const productsdelete = $("#productsdelete").is(":checked");
    const invoicecreate = $("#invoicecreate").is(":checked");
    const invoiceupdate = $("#invoiceupdate").is(":checked");
    const invoiceread = $("#invoiceread").is(":checked");
    const invoicedelete = $("#invoicedelete").is(":checked");
    const userscreate = $("#userscreate").is(":checked");
    const usersupdate = $("#usersupdate").is(":checked");
    const usersread = $("#usersread").is(":checked");
    const usersdelete = $("#usersdelete").is(":checked");
    return {
        id,
        name,
        type,
        companyupdate,
        customercreate,
        customerupdate,
        customerread,
        customerdelete,
        productscreate,
        productsupdate,
        productsread,
        productsdelete,
        invoicecreate,
        invoiceupdate,
        invoiceread,
        invoicedelete,
        userscreate,
        usersupdate,
        usersread,
        usersdelete
    };
}

async function saveuser() {
    const userInfo = getSettingVal();
    const userid = $("#loginUser").attr("data-userid");
    const password = $("#password").val() || null;
    const nwepass = $("#nwepass").val() || null;
    const checkedpass = $("#checkedpass").val() || null;

    let url = `/put/user/${userInfo.id}`;
    // 如果有填寫密碼，代表要新增使用者
    if (!userInfo.id) {
        if (!password || !userInfo.name) {
            alert("新增使用者，名稱與密碼欄位請勿空白！");
            !password
                ? $("#password").addClass("border-danger")
                : $("#password").removeClass("border-danger");
            !userInfo.name
                ? $("#name").addClass("border-danger")
                : $("#name").removeClass("border-danger");
            return;
        }
        userInfo.password = password;
        url = "/post/user";
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    };
    let response = await fetch(url, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alert(errmsg);
        return;
    }

    // 有新密碼，代表要改密碼
    if (nwepass) {
        if (userInfo.id && userInfo.id != userid) {
            alert("非本人無法修改密碼！");
            window.location.href = "user";
        }
        url = `/patch/user/${userInfo.id}`;
        if (nwepass != checkedpass) {
            alert("修改密碼與確認密碼不一致");
            $("#nwepass").addClass("border-danger");
            $("#checkedpass").addClass("border-danger");
            return;
        } else {
            $("#nwepass").removeClass("border-danger");
            $("#checkedpass").removeClass("border-danger");
            userInfo.nwepass = nwepass;
        }
        response = await fetch(url, config);
        if (!response.ok) {
            const errmsg = await response.text();
            alert(errmsg);
            return;
        }
        window.location.href = "user";
    } else {
        window.location.href = "user";
    }
}

async function deleteuser() {
    const id = $("#id").val() || null;
    if (!id || id.length != 36) {
        alert("刪除請填寫完整的使用者id");
        $("#id").addClass("border-danger");
        return;
    }

    const check = confirm("確定要刪除嗎？");
    if (check) {
        const response = await fetch(`/delete/user/${id}`);
        if (!response.ok) {
            const errmsg = await response.text();
            alert(errmsg);
        }
        window.location.href = "user";
    }
}
