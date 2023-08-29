$(document).ready(function () {
    $(document).on("keydown", function (event) {
        if (event.code === "Enter") {
            login();
        }
    });
});

async function login() {
    const regex = /[A-Za-z0-9]/;
    const user = $("#user").val();
    const password = $("#password").val();

    if (user === "" || password === "") {
        !user
            ? $("#user").addClass("border-danger")
            : $("#user").removeClass("border-danger");
        !password
            ? $("#password").addClass("border-danger")
            : $("#password").removeClass("border-danger");
        alert("欄位不可以空白！");
        return;
    }

    if (password.match(regex) === null) {
        $("#password").addClass("border-danger");
        alert("密碼只能為數字或英文！");
        return;
    } else {
        $("#password").removeClass("border-danger");
    }
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, password })
    };
    const response = await fetch("/login", config);
    if (response.ok) {
        window.location.href = `/company`;
    } else {
        const errmsg = await response.text();
        alert(errmsg);
    }
}
