$(async function () {
    const url = new URL(location.href);
    const id = url.searchParams.get("id");
    const type = url.searchParams.get("type");

    const response = await fetch(`/creatxml/${type}/${id}`);
    if (response.ok) {
        const data = await response.text();
        $("#XML").text(data);
        console.log(data);
    }
    // $("#XML").attr("height", screenHeight);
    // if (type === "0" && statement === "true") {
    //     $("#PDF").attr("src", `/print/invoiceAndStatementPDF/${id}`);
    // } else if (type === "0" && statement === "false") {
    //     $("#PDF").attr("src", `/print/invoicePDF/${id}`);
    // } else if (type != "0" && statement === "true") {
    //     $("#PDF").attr("src", `/print/statementPDF/${id}`);
    // }
});
