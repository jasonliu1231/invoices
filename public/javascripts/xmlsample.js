$(async function () {
    const url = new URL(location.href);
    const id = url.searchParams.get("id");
    const type = url.searchParams.get("type");
    $("#type").html(type);
    const response = await fetch(`/creatxml/${type}/${id}`);
    if (response.ok) {
        const data = await response.text();
        $("#XML").text(data);
    }
});
