$(function () {
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
});
