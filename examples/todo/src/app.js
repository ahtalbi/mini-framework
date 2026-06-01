import { createElement, render } from "../../../framework/dom";
import router from "../../../framework/mini-framework";
import TodoMVC from "./pages/todo";

router.on("/", () => {
    let root = document.querySelector("#root");
    render(<TodoMVC />, root);
});

router.listen(() => {alert("404")});
