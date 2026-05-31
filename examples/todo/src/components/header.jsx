import { createElement } from "../../../../framework/dom";

function Header() {
    //add mountTodoApp to the input
    return (
        <header class="header" data-testid="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus />
        </header>
    )
}

export default Header
