import { createElement } from "../../../../framework/dom";

function Footer() {
    return (
        <footer class="footer" data-testid="footer">
            <span class="todo-count">0 items left</span>
            <ul class="filters" data-testid="footer-navigation">
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
