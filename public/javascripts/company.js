$(async function () {
    const response = await fetch("/get/company");
    if (response.ok) {
        const info = await response.json();
        $("#name").val(info.name);
        $("#personInCharge").val(info.personincharge);
        $("#unum").val(info.unum);
        $("#taxId").val(info.taxid);
        $("#companyAddress").val(info.companyaddress);
        $("#connectionAddress").val(info.connectionaddress);
        if (
            info.companyaddress &&
            info.companyaddress === info.connectionaddress
        ) {
            $("#setAddress").attr("checked", true);
        }
        $("#tel").val(info.tel);
        $("#facsimileNumber").val(info.facsimilenumber);
        $("#email").val(info.email);
        $("#roleremark").val(info.roleremark);
        $("#customName").val(info.customname);
        $(`input[value=${info.printtype}]`).prop("checked", true);
        if (!!info.invoicetitleimage) {
            $("#inputImg").attr("src", info.invoicetitleimage);
            $("#inputFile").hide();
        }
        if (info.printtype === "1") {
            $("#inputImg").hide();
            $("#customName").hide();
        } else if (info.printtype === "2") {
            $("#customName").hide();
        } else {
            $("#inputImg").hide();
        }
    }
});

function changeType() {
    let checked = $("input[name=type]:checked");
    if (checked.val() === "2") {
        $("#inputImg").show();
        $("#inputImg")[0].currentSrc
            ? $("#inputFile").hide()
            : $("#inputFile").show();
    } else {
        $("#inputImg").hide();
    }
    checked.val() === "3" ? $("#customName").show() : $("#customName").hide();
}

function setAddr() {
    let ischecked = $("#setAddress").is(":checked");
    if (ischecked) {
        $("#connectionAddress").val($("#companyAddress").val());
    }
}

function changimg() {
    $("#inputFile").click();
}

async function readimg() {
    //判斷瀏覽器支援 filereader，IE 好像就不能...
    if (typeof FileReader === "undifined") {
        alertBox("warning", "瀏覽器不支援");
        return;
    }
    let invoicetitleimage = $("#inputFile")[0].files[0];
    //判斷是否為圖片檔
    if (!/image\/\w+/.test(invoicetitleimage.type)) {
        alertBox("warning", "文件不是圖片");
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(invoicetitleimage);
    reader.onload = function (e) {
        let img = new Image();
        img.src = this.result;
        img.onload = () => {
            let canvas = document.createElement("canvas");
            // 畫布高度比例調整到50以下
            let range = 100;
            while ((range / 100) * img.height > 50) {
                range--;
            }
            canvas.width = (img.width * range) / 100;
            canvas.height = (img.height * range) / 100;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 把圖片畫在畫布上(0,0)作標到(canvas.width,canvas.height)
            let newImg = canvas.toDataURL(img, 0.8); // 0.8是圖片壓縮比

            $("#inputImg")[0].src = newImg;
        };
        $("#inputFile").hide();
    };
}

function setCompanyInfo(companyInfo) {
    $("#name").val(companyInfo.name);
    $("#personInCharge").val(companyInfo.personInCharge);
    $("#unum").val(companyInfo.unum);
    $("#taxId").val(companyInfo.taxId);
    $("#companyAddress").val(companyInfo.companyAddress);
    $("#connectionAddress").val(companyInfo.connectionAddress);
    $("#tel").val(companyInfo.tel);
    $("#facsimileNumber").val(companyInfo.facsimileNumber);
    $("#email").val(companyInfo.email);
    $("#roleremark").val(companyInfo.roleremark);
    $("[name=type]:checked").val(companyInfo.printType);
    $("#customName").val(companyInfo.customName);
    $("#inputImg").attr("src", companyInfo.inputImg);
}

async function saveCompany() {
    const name = $("#name").val().trim() || null,
        personInCharge = $("#personInCharge").val().trim() || null,
        unum = $("#unum").val().trim() || null,
        taxId = $("#taxId").val().trim() || null,
        companyAddress = $("#companyAddress").val().trim() || null,
        connectionAddress = $("#connectionAddress").val().trim() || null,
        tel = $("#tel").val().trim() || null,
        facsimileNumber = $("#facsimileNumber").val().trim() || null,
        email = $("#email").val().trim() || null,
        roleremark = $("#roleremark").val().trim() || null,
        printType = $("[name=type]:checked").val() || null,
        customName = $("#customName").val().trim() || null,
        inputImg = $("#inputImg")[0].currentSrc || null;

    if (!name || !unum) {
        !name
            ? $("#name").addClass("border-danger")
            : $("#name").removeClass("border-danger");
        !unum
            ? $("#unum").addClass("border-danger")
            : $("#unum").removeClass("border-danger");
        alertBox("warning", "必填欄位不可空白");
        return;
    }

    if (taxId && taxId.length != 9) {
        $("#taxId").addClass("border-danger");
        alertBox("warning", "稅籍編號只能9碼");
        return;
    } else {
        $("#taxId").removeClass("border-danger");
    }

    if (unum.length != 8) {
        $("#unum").addClass("border-danger");
        alertBox("warning", "統一編號只能8碼");
        return;
    } else {
        $("#unum").removeClass("border-danger");
    }

    const companyInfo = {
        name,
        personInCharge,
        unum,
        taxId,
        companyAddress,
        connectionAddress,
        tel,
        facsimileNumber,
        email,
        roleremark,
        printType,
        customName,
        inputImg
    };

    const userid = localStorage.getItem("id");
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        },
        body: JSON.stringify(companyInfo)
    };
    const response = await fetch(`/put/company`, config);
    if (!response.ok) {
        const errmsg = await response.text();
        alertBox("error", errmsg);
    } else {
        await alertBox("success");
        setCompanyInfo(companyInfo);
    }
}
