import { createElement } from "../../../../framework/dom";
import TodoItem from "../components/todo-item";
import { on } from "./events";
import { createSignal, createEffect } from "../../../../framework/reactivity";

const [getTodos, rawSetTodos] = createSignal([]);
const [getEditing, rawSetEditing] = createSignal(null);

const normalizeRoute = (hash) => {
    const route = String(hash || "").replace(/^#\/?/, "").replace(/\/+$/, "");
    return route === "" ? "all" : route;
};

const validRoute = (route) => route === "all" || route === "active" || route === "completed";

const [getRoute, rawSetRoute] = createSignal(normalizeRoute(location.hash));

const idOf = (el) => el.closest("li").todoId;

const shown = () => {
    const route = getRoute();
    const todos = getTodos();
    if (route === "active") return todos.filter(t => !t.completed);
    if (route === "completed") return todos.filter(t => t.completed);
    return todos;
};

const counts = () => {
    const todos = getTodos();
    const active = todos.filter((todo) => !todo.completed).length;
    return { active, completed: todos.length - active };
};

let lastActiveCount = null;
let lastTotalCount = null;
let lastRenderedRoute = null;
let lastValidRoute = validRoute(normalizeRoute(location.hash)) ? normalizeRoute(location.hash) : null;

function focusFilter(route) {
    if (!route) return;

    document.querySelectorAll(".filters a").forEach((link) => {
        if (normalizeRoute(link.getAttribute("href")) === route) {
            link.focus();
        }
    });
}

function renderStatus() {
    const app = document.querySelector(".todoapp");
    if (!app) return;

    const todos = getTodos();
    const { active, completed } = counts();
    const total = todos.length;
    const route = getRoute();

    if (lastTotalCount !== total) {
        app.querySelector(".main").classList.toggle("hidden", !total);
        app.querySelector(".footer").classList.toggle("hidden", !total);
        app.querySelector(".clear-completed").classList.toggle("hidden", !total);
        lastTotalCount = total;
    }
    app.querySelector(".toggle-all-container").classList.toggle(
        "hidden",
        (route === "active" && active === 0) || (route === "completed" && completed === 0)
    );
    app.querySelector(".toggle-all").checked = total && !active;

    if (lastActiveCount !== active) {
        app.querySelector(".todo-count").replaceChildren(
            createElement("strong", null, String(active)),
            ` ${active === 1 ? "item" : "items"} left`
        );
        lastActiveCount = active;
    }

    if (lastRenderedRoute !== route) {
        app.querySelectorAll(".filters a").forEach((link) => {
            const filter = normalizeRoute(link.getAttribute("href"));
            link.classList.toggle("selected", filter === route);
        });
        lastRenderedRoute = route;
    }
}

function toggleOne(input) {
    const id = idOf(input);
    const li = input.closest("li");
    const nowCompleted = input.checked;

    li.classList.toggle("completed", nowCompleted);

    if (lastRenderedItems) {
        lastRenderedItems = lastRenderedItems.map((item) =>
            item.id === id ? { ...item, completed: nowCompleted } : item
        );
    }

    rawSetTodos(getTodos().map((t) => t.id === id ? { ...t, completed: nowCompleted } : t));
}

function saveEdit(input) {
    const id = idOf(input);
    const todos = getTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const title = input.value.trim();

    if (title.length < 2) {
        input.focus();
        return;
    }

    rawSetEditing(null);

    if (title !== todo.title) {
        rawSetTodos(todos.map((t) => t.id === id ? { ...t, title } : t));
    }
}

let lastRenderedItems = null;

function renderTodoList() {
    const app = document.querySelector(".todoapp");
    if (!app) return;

    const editing = getEditing();
    const currentItems = shown().map((todo) => ({ ...todo, editing: editing === todo.id }));

    if (
        lastRenderedItems &&
        lastRenderedItems.length === currentItems.length &&
        lastRenderedItems.every((item, idx) =>
            item.id === currentItems[idx].id &&
            item.title === currentItems[idx].title &&
            item.completed === currentItems[idx].completed &&
            item.editing === currentItems[idx].editing
        )
    ) {
        return;
    }

    lastRenderedItems = currentItems;
    const list = app.querySelector(".todo-list");
    list.replaceChildren(...currentItems.map((todo) => TodoItem(todo)));

    const edit = list.querySelector(".editing .edit");
    if (edit) {
        edit.focus();
        edit.select();
    }
}

export function renderTodoApp() {
    renderTodoList();
    renderStatus();
}

let cleanups = [];

export function mountTodoApp() {
    queueMicrotask(() => {
        const app = document.querySelector(".todoapp");
        if (!app) return;

        cleanups.forEach((done) => done());
        lastActiveCount = null;
        lastTotalCount = null;
        lastRenderedRoute = null;
        lastRenderedItems = null;

        const onHashChange = () => {
            const nextRoute = normalizeRoute(location.hash);
            if (validRoute(nextRoute)) {
                lastValidRoute = nextRoute;
            } else {
                queueMicrotask(() => focusFilter(lastValidRoute));
            }
            if (nextRoute !== getRoute()) {
                rawSetRoute(nextRoute);
            }
        };

        const handleClickOutsideEdit = (event) => {
            if (getEditing() !== null && !event.target.closest(".edit") && !event.target.closest(".editing")) {
                rawSetEditing(null);
            }
        };

        cleanups = [
            on(app, "keydown", ".new-todo", (event, input) => {
                const title = input.value.trim();
                if (event.key === "Enter" && title.length >= 2) {
                    rawSetTodos(getTodos().concat({ id: String(Date.now()), title, completed: false }));
                    input.value = "";
                }
            }),
            on(app, "change", ".toggle-all", (event, input) => {
                rawSetTodos(getTodos().map((todo) => ({ ...todo, completed: input.checked })));
            }),
            on(app, "change", ".todo-list .toggle", (event, input) => toggleOne(input)),
            on(app, "click", ".destroy", (event, button) => {
                if (getEditing() !== null) rawSetEditing(null);
                rawSetTodos(getTodos().filter((todo) => todo.id !== idOf(button)));
            }),
            on(app, "dblclick", ".todo-list label", (event, label) => {
                rawSetEditing(idOf(label));
            }),
            on(app, "keydown", ".edit", (event, input) => {
                if (event.key === "Enter") saveEdit(input);
                if (event.key === "Escape") rawSetEditing(null);
            }),
            on(app, "focusout", ".edit", (event, input) => {
                if (input.closest(".editing")) rawSetEditing(null);
            }),
            on(app, "click", ".todo-list", handleClickOutsideEdit),
            on(app, "click", ".clear-completed", () => {
                rawSetTodos(getTodos().filter((todo) => !todo.completed));
            }),
            () => {
                window.removeEventListener("hashchange", onHashChange);
                app.removeEventListener("click", handleClickOutsideEdit);
            },
        ];

        window.addEventListener("hashchange", onHashChange);
        onHashChange();
        renderTodoApp();
        createEffect(renderStatus);
        createEffect(renderTodoList);
    });
}
