import { createElement } from "../../../../framework/dom";

function TodoItem(todo) {
    const { id, title, completed, editing } = todo;
    const classes = [
        completed ? "completed" : "",
        editing ? "editing" : "",
    ].filter(Boolean).join(" ");

    const item = (
        <li class={classes} data-testid="todo-item" data-id={id}>
            <div class="view">
                <input class="toggle" type="checkbox" data-testid="todo-item-toggle" />
                <label data-testid="todo-item-label">
                    {title}
                </label>
                <button class="destroy" data-testid="todo-item-button" type="button" />
            </div>
            <input class="edit" data-testid="todo-item-edit" value={title} />
        </li>
    );

    item.querySelector(".toggle").checked = completed;
    return item;
}

export default TodoItem
