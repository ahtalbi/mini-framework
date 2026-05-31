import { createElement } from "../../../../framework/dom";

function Header() {
    return (
        <header class="header" data-testid="header">
            <h1>todos</h1>
            <input label="New Todo Input" placeholder="What needs to be done?" />
        </header>
    )
}

export default Header
