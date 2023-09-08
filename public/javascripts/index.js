$(async function () {
    let token = localStorage.getItem("token");
    // 判斷有沒有登入的 token 如果比對得上直接登入
    if (token) {
        const response = await fetch(`/login/${token}`);
        if (response.ok) {
            window.location.href = `/company/${token}`;
        }
    }
    $("body").show();
});

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
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("name", data.name);
        window.localStorage.setItem("id", data.id);
        window.location.href = `/company/${data.token}`;
    } else {
        const errmsg = await response.text();
        alert(errmsg);
    }
}
