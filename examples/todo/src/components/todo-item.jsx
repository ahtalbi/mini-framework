import { createElement } from "../../../../framework/dom";

function TodoItem(todo) {
    const { id, title, completed, editing } = todo;
    const classes = [
        completed ? "completed" : "",
        editing ? "editing" : "",
    ].filter(Boolean).join(" ");

    const item = (
        <li class={classes}>
            <div class="view">
                <input class="toggle" type="checkbox" />
                <label>
                    {title}
                </label>
                <button class="destroy" type="button" />
            </div>
            <input class="edit" value={title} />
        </li>
    );

    item.querySelector(".toggle").checked = completed;
    item.todoId = id;
    return item;
}

export default TodoItem
