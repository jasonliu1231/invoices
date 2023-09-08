$(async function () {
    const userid = localStorage.getItem("id");
    const response = await fetch(`/get/product/${userid}`);
    if (!response.ok) {
        const errmsg = await response.text();
        $("#errorMsg").html(errmsg);
    }

    const data = await response.json();
    const categorys = new Set();
    data.forEach((item) => {
        categorys.add(item.category);
    });
    for (let category of categorys.keys()) {
        const option = $(`<option value="${category}"></option>`);
        $("#typelist").append(option);
        const item = $("<div></div>");
        const collapsebtn = `<button class="btn btn-outline-secondary btn-sm my-2" type="button" data-bs-toggle="collapse"
                        data-bs-target="#${category}" aria-expanded="false" aria-controls="collapseExample">
                        ${category}
                    </button>`;
        const collapseData = $(`<div class="collapse" id="${category}"></div>`);
        const collapseCard = $(`<div class="card card-body"></div>`);
        let collapseText = "";
        data.forEach((item) => {
            if (item.category === category) {
                collapseText += `<div data-bs-dismiss="offcanvas" aria-label="Close" class="p-1" style="cursor: pointer;" onclick="selectproduct('${item.id}')">
                                    <div class="d-flex justify-content-between collapseText">
                                        <span class="icon-link icon-link-hover">${item.name}</span>
                                        <span>$${item.price}</span>
                                    </div>
                                </div>`;
            }
        });
        collapseCard.append(collapseText);
        collapseData.append(collapseCard);
        item.append(collapsebtn).append(collapseData);
        $("#collapseInfo").append(item);
    }
});

async function selectproduct(id) {
    const userid = localStorage.getItem("id");
    const response = await fetch(`/get/product/${userid}/${id}`);
    if (!response.ok) {
        const errmsg = await response.text();
        alert(errmsg);
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

async function saveproduct() {
    const token = localStorage.getItem("token");
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
        alert("必填欄位不可空白");
        return;
    }

    let url = "";
    if (!productsInfo.id) {
        url = `/post/product/${userid}`;
    } else {
        url = `/put/product/${userid}/${productsInfo.id}`;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productsInfo)
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alert(errmsg);
        return;
    } else {
        window.location.href = `../products/${token}`;
    }
}

async function deleteproduct() {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");
    const id = $("#id").val() || null;
    if (!id || id.length != 36) {
        alert("刪除請填寫完整的產品id");
        $("#id").addClass("border-danger");
        return;
    }

    const check = confirm("確定要刪除嗎？");
    if (check) {
        const response = await fetch(`/delete/product/${userid}/${id}`);
        if (!response.ok) {
            const errmsg = await response.text();
            alert(errmsg);
        }
        window.location.href = `../products/${token}`;
    }
}
