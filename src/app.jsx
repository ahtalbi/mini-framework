import { createElement } from "../framework/main.js";

function app() {
  return (
    <div>
      <h1>Hello world!</h1>
      <div id="hello">
        <h2>test</h2>
      </div>
    </div>
  )
}

let rout = document.getElementById('root');
rout.append(createElement(app));