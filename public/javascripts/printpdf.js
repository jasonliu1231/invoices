$(function () {
    const url = new URL(location.href);
    const id = url.searchParams.get("id");
    const statement = url.searchParams.get("statement");
    const type = url.searchParams.get("type");
    const screenHeight = window.innerHeight;
    $("#PDF").attr("height", screenHeight);
    if (type === "0" && statement === "true") {
        $("#PDF").attr("src", `/print/invoiceAndStatementPDF/${id}`);
    } else if (type === "0" && statement === "false") {
        $("#PDF").attr("src", `/print/invoicePDF/${id}`);
    } else if (type != "0" && statement === "true") {
        $("#PDF").attr("src", `/print/statementPDF/${id}`);
    } else {
        $("#PDF").attr("src", `/print/cnote/${id}`);
    }
});
