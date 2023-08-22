$(document).ready(function () {
    $(document).on("keydown", function (event) {
        // 检查按下的键的键码
        if (event.code === "Enter") {
            Signin();
        }
    });
});

async function Signin() {
    const regex = /[A-Za-z0-9]/;
    const user = $("#text_Signin").val();
    const password = $("#text_Password").val();

    if (user == "" || password == "") {
        alert("欄位不可以空白！");
        return;
    }

    if (password.match(regex) === null) {
        alert("密碼只能為數字或英文！");
        return;
    }
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, password })
    };
    const response = await fetch("/users/signin", config);
    if (response.ok) {
        const data = await response.json();
        window.location.href = `/company`;
        console.log(data)
    } else {
        const errmsg = await response.text();
        alert(errmsg);
    }
}
