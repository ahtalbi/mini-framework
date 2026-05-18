import { createElement } from "../framework/main.js";
function app() {
  return createElement("div", null, createElement("h1", null, "Hello world!"), createElement("div", {
    id: "hello"
  }, createElement("h2", null, "test")));
}
var rout = document.getElementById('root');
rout.append(createElement(app));