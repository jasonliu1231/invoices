$(async function () {
    searchProduct();
});

async function selectproduct(id) {
    const userid = localStorage.getItem("id");
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        }
    };
    const response = await fetch(`/get/product/${id}`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    }
    const data = await response.json();
    $("#id").val(data.id);
    $("#name").val(data.name);
    $("#category").val(data.category);
    $("#no").val(data.no);
    $("#barcode").val(data.barcode);
    $("#price").val(data.price);
    $("#unit").val(data.unit);
    $("#remark").val(data.remark);
}

function setProduct() {
    $("#id").val("");
    $("#name").val("");
    $("#category").val("");
    $("#no").val("");
    $("#barcode").val("");
    $("#price").val("");
    $("#unit").val("");
    $("#remark").val("");
}

function getSettingVal() {
    const id = $("#id").val() || null;
    const name = $("#name").val() || null;
    const category = $("#category").val() || null;
    const no = $("#no").val() || null;
    const barcode = $("#barcode").val() || null;
    const price = $("#price").val() || null;
    const unit = $("#unit").val() || null;
    const remark = $("#remark").val() || null;

    return {
        id,
        name,
        category,
        no,
        barcode,
        price,
        unit,
        remark
    };
}

async function saveProduct() {
    const userid = localStorage.getItem("id");
    const productsInfo = getSettingVal();
    if (!productsInfo.name || !productsInfo.category || !productsInfo.price) {
        !productsInfo.name
            ? $("#name").addClass("border-danger")
            : $("#name").removeClass("border-danger");
        !productsInfo.category
            ? $("#category").addClass("border-danger")
            : $("#category").removeClass("border-danger");
        !productsInfo.price
            ? $("#price").addClass("border-danger")
            : $("#price").removeClass("border-danger");
        alertBox("warning", "必填欄位不可空白");
        return;
    }

    let url = "";
    if (!productsInfo.id) {
        url = `/post/product`;
    } else {
        url = `/put/product/${productsInfo.id}`;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        },
        body: JSON.stringify(productsInfo)
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
        return;
    } else {
        const token = localStorage.getItem("token");
        alertBox("success");
        setTimeout(() => {
            window.location.href = `/products/${token}`;
        }, 1500);
    }
}

async function deleteProduct() {
    const userid = localStorage.getItem("id");
    const id = $("#id").val() || null;
    if (!id || id.length != 36) {
        alertBox("warning", "刪除請填寫完整的產品id");
        $("#id").addClass("border-danger");
        return;
    }

    const check = confirm("確定要刪除嗎？");
    if (check) {
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                userid: userid
            }
        };
        const response = await fetch(`/delete/product/${id}`, config);
        if (!response.ok) {
            const errmsg = await response.text();
            alertBox("error", errmsg);
        }
        const token = localStorage.getItem("token");
        alertBox("success");
        setTimeout(() => {
            window.location.href = `/products/${token}`;
        }, 1500);
    }
}

async function changeCategory() {
    const typelist2 = $("#typelist2").val() || null;
    const newName = $("#newName").val() || null;
    const userid = localStorage.getItem("id");

    if (!newName) {
        alertBox("warning", "更改名稱欄位不可以是空的！");
        $("#newName").addClass("border-danger");
        return;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        },
        body: JSON.stringify({ typelist2, newName })
    };
    const response = await fetch(`/patch/product`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        $("#errorMsg").html(errmsg);
    } else {
        const token = localStorage.getItem("token");
        alertBox("success");
        setTimeout(() => {
            window.location.href = `/products/${token}`;
        }, 1500);
    }
}
