import { createElement } from "../../../../framework/dom";
import { mountTodoApp } from "../logic/todo";

function Header() {
    //add mountTodoApp to the input
    mountTodoApp()
    return (
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus />
        </header>
    )
}

export default Header
