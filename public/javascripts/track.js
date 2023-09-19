$(async function () {
    const date = new Date();
    const last = new Date();
    last.setMonth(date.getMonth() - 2);
    if (date.getMonth() % 2 == 0 && date.getDate() <= 10) {
        const str = `提醒您，${date.getFullYear()}年${
            date.getMonth() + 1
        }月10日(含)前應上傳${last.getFullYear()}年${last.getMonth() + 1}-${
            last.getMonth() + 2
        }月空白未使用發票號碼。`;
        const html = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>重要提醒!</strong>${str}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
        $("#alertbar").html(html);
    }

    const userid = localStorage.getItem("id");
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        }
    };
    let response = await fetch("/get/track", config);
    if (response.ok) {
        const data = await response.json();
        let html = ``;
        data.forEach((item) => {
            html += `<tr onclick="handleTableRowClick(event)">
                        <th scope="row"><input class="form-check-input me-1" type="checkbox" value="${
                            item.id
                        }"></th>
                        <td>${item.type} / 一般稅額計算</td>
                        <td>${trackDate(item.yearmonth)}</td>
                        <td>${item.tnum}</td>
                        <td>${item.beginno}</td>
                        <td>${item.endno}</td>
                        <td>${item.usedno ? item.usedno : "未曾使用"}</td>
                        <td>${item.disabled ? "已上傳" : "使用中"}</td>
                    </tr>`;
        });
        $("#trackBody").html(html);
    } else {
        const errmsg = await response.text();
        alert(errmsg);
    }
});

function trackDate(date) {
    const start = (date - 2).toString();
    const due = date.toString();
    return `${start.substring(0, 3)}/${start.substring(3, 5)} ~ ${due.substring(
        0,
        3
    )}/${due.substring(3, 5)}`;
}

async function saveFile() {
    clearFileInput();
    const items = $("#fileInfo tbody tr");
    const tracks = [];
    items.each((index, item) => {
        const itemInfo = $(item).children("td");
        const arr = [];
        itemInfo.each((index, td) => {
            const val = $(td).html();
            arr[index] = val;
        });
        const info = {
            unum: arr[0],
            type: arr[1],
            yearmonth: arr[3],
            tnum: arr[4],
            beginno: arr[5],
            endno: arr[6]
        };
        tracks.push(info);
    });
    console.log(tracks);

    const userid = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            userid: userid
        },
        body: JSON.stringify(tracks)
    };
    let response = await fetch("/post/track", config);
    if (response.ok) {
        window.location.href = `/track/${token}`;
    } else {
        const errmsg = await response.text();
        alert(errmsg);
    }
}

function clearFileInput() {
    $("#fileInput").val("");
}

function csvToArray(result) {
    let resultArray = [];
    result.split("\n").forEach(function (row) {
        if (row) {
            row = row.trimEnd();
            let rowArray = [];
            row.split(",").forEach(function (cell) {
                rowArray.push(cell);
            });
            resultArray.push(rowArray);
        }
    });
    return resultArray;
}

function csvtojson() {
    const invoicetrack = $("#fileInput")[0].files[0];
    $("#offcanvas").click();
    var reader = new FileReader();
    reader.readAsText(invoicetrack, "big5");
    reader.onload = function (e) {
        var csv = e.target.result;
        const array = csvToArray(csv);
        let html = '<table class="table table-hover text-center">';
        for (let i = 0; i < array.length; i++) {
            const info = array[i];
            if (i === 0) {
                html += `<thead class="table-dark"><tr>`;
                for (let j = 0; j < info.length; j++) {
                    html += `<td scope="col">${info[j]}</td>`;
                }
                html += `</tr></thead>`;
            } else {
                if (i === 1) {
                    html += `<tbody><tr>`;
                } else {
                    html += `<tr>`;
                }
                for (let j = 0; j < info.length; j++) {
                    html += `<td>${info[j]}</td>`;
                }
                html += `</tr>`;
            }
        }
        html += "</tbody></table>";
        html += `<button style="right: 16px;" type="button" class="btn btn-primary position-absolute" data-bs-dismiss="offcanvas" onclick="saveFile()">儲存</button>`;
        $("#fileInfo").html(html);
    };
}

function addItem() {
    $("#fileInput").click();
}

function allselect() {
    const allCheckBtn = $("#allcheck");
    const inputs = $("table tbody input");
    if (allCheckBtn.is(":checked")) {
        allCheckBtn.prop("checked", true);
        inputs.prop("checked", true);
    } else {
        allCheckBtn.prop("checked", false);
        inputs.prop("checked", false);
    }
}

function handleTableRowClick(event) {
    // 如果是input，阻止事件冒泡
    if (event.target.tagName === "INPUT") {
        event.stopPropagation();
    } else {
        setInput(event);
    }
}

function setInput(e) {
    const input = $(e.target).parent().find("input");
    if (input.is(":checked")) {
        input.prop("checked", false);
    } else {
        input.prop("checked", true);
    }
}
