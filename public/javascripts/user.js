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
    data.companyupdate ? $('#companyupdate').prop("checked", true) : $('#companyupdate').prop("checked", false);
    data.customercreate ? $('#customercreate').prop("checked", true) : $('#customercreate').prop("checked", false);
    data.customerupdate ? $('#customerupdate').prop("checked", true) : $('#customerupdate').prop("checked", false);
    data.customerread ? $('#customerread').prop("checked", true) : $('#customerread').prop("checked", false);
    data.customerdelete ? $('#customerdelete').prop("checked", true) : $('#customerdelete').prop("checked", false);
    data.productscreate ? $('#productscreate').prop("checked", true) : $('#productscreate').prop("checked", false);
    data.productsupdate ? $('#productsupdate').prop("checked", true) : $('#productsupdate').prop("checked", false);
    data.productsread ? $('#productsread').prop("checked", true) : $('#productsread').prop("checked", false);
    data.productsdelete ? $('#productsdelete').prop("checked", true) : $('#productsdelete').prop("checked", false);
    data.invoicecreate ? $('#invoicecreate').prop("checked", true) : $('#invoicecreate').prop("checked", false);
    data.invoiceupdate ? $('#invoiceupdate').prop("checked", true) : $('#invoiceupdate').prop("checked", false);
    data.invoiceread ? $('#invoiceread').prop("checked", true) : $('#invoiceread').prop("checked", false);
    data.invoicedelete ? $('#invoicedelete').prop("checked", true) : $('#invoicedelete').prop("checked", false);
    data.userscreate ? $('#userscreate').prop("checked", true) : $('#userscreate').prop("checked", false);
    data.usersupdate ? $('#usersupdate').prop("checked", true) : $('#usersupdate').prop("checked", false);
    data.usersread ? $('#usersread').prop("checked", true) : $('#usersread').prop("checked", false);
    data.usersdelete ? $('#usersdelete').prop("checked", true) : $('#usersdelete').prop("checked", false);
}

function changePassword() {
    $("#newPassword").toggle();
}
