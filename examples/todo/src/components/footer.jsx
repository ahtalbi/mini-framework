import { createElement } from "../../../../framework/dom";

function Footer() {
    return (
        <footer class="footer">
            <span class="todo-count">0 items left</span>
            <ul class="filters">
                <li>
                    <a href="#/">All</a>
                </li>
                <li>
                    <a href="#/active">Active</a>
                </li>
                <li>
                    <a href="#/completed">Completed</a>
                </li>
            </ul>
            <button class="clear-completed">Clear completed</button>
        </footer>
    )
}

export default Footer
