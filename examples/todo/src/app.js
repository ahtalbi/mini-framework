import { createElement, render } from "../../../framework/dom";
import router from "../../../framework/mini-framework";
import Helloworld from "./components/helloworld";

router.on("/", () => {
    let root = document.querySelector("#root");
    render(<Helloworld />, root);
});

router.listen(() => {alert("404")});
