import router from "../../../framework/mini-framework.js";

router.on("/", () => {
    let root = document.querySelector("#root");
    root.innerHTML = "hello world";
});

router.listen(() => {alert("404")})