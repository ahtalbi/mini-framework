import { createElement } from "../../../../framework/dom";
import TodoItem from "../components/todo-item";
import { on } from "./events";
import { createSignal, createEffect } from "../../../../framework/reactivity";

const useState = createSignal;
const [getTodos, rawSetTodos] = useState([]);
const [getEditing, rawSetEditing] = useState(null);

const normalizeRoute = (value) => {
    const raw = String(value || "");
    const route = raw.replace(/^#\/?/, "").replace(/\/+$/, "");
    return route === "" ? "all" : route;
};

const [getRoute, rawSetRoute] = useState(normalizeRoute(location.hash));

const setTodos = (next) => {
    const current = getTodos();
    if (next === current) return;
    if (Array.isArray(next) && Array.isArray(current) &&
        next.length === current.length &&
        next.every((item, idx) => item === current[idx])) {
        return;
    }
    rawSetTodos(next);
};

const setEditing = (next) => {
    if (next === getEditing()) return;
    rawSetEditing(next);
};

const setRoute = (next) => {
    const nextRoute = normalizeRoute(next);
    if (nextRoute === getRoute()) return;
    rawSetRoute(nextRoute);
};

let cleanups = [];

const idOf = (el) => el.closest("li").todoId;
const route = () => getRoute();
const shown = () => getTodos().filter((todo) => route() === "active" ? !todo.completed : route() === "completed" ? todo.completed : true);
const counts = () => {
    const todos = getTodos();
    const active = todos.filter((todo) => !todo.completed).length;
    return { active, completed: todos.length - active };
};

function renderStatus() {
    const app = document.querySelector(".todoapp");
    if (!app) return;

    const todos = getTodos();
    const { active, completed } = counts();

    app.querySelector(".main").classList.toggle("hidden", !todos.length);
    app.querySelector(".footer").classList.toggle("hidden", !todos.length);
    app.querySelector(".toggle-all").checked = todos.length && !active;
    app.querySelector(".todo-count").replaceChildren(
        createElement("strong", null, String(active)),
        ` ${active === 1 ? "item" : "items"} left`
    );
    app.querySelector(".clear-completed").classList.toggle("hidden", !todos.length);
    app.querySelectorAll(".filters a").forEach((link) => {
        const filter = normalizeRoute(link.getAttribute("href"));
        link.classList.toggle("selected", filter === route());
    });
}

function toggleOne(input) {
    const id = idOf(input);
    const todos = getTodos();
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;

    setTodos(todos.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));
}

function saveEdit(input) {
    const id = idOf(input);
    const todos = getTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newTitle = input.value.trim();
    setEditing(null);

    if (!newTitle || newTitle === todo.title) {
        return;
    }

    setTodos(todos.map((t) => t.id === id ? { ...t, title: newTitle } : t));
}

let lastRenderedRoute = null;
let lastRenderedCount = null;

function renderTodoList() {
    const app = document.querySelector(".todoapp");
    if (!app) return;

    const currentRoute = route();
    const currentCount = shown().length;
    
    if (lastRenderedRoute === currentRoute && lastRenderedCount === currentCount) {
        return;
    }
    
    lastRenderedRoute = currentRoute;
    lastRenderedCount = currentCount;

    const editing = getEditing();
    const list = app.querySelector(".todo-list");
    list.replaceChildren(...shown().map((todo) => TodoItem({ ...todo, editing: editing === todo.id })));

    const edit = list.querySelector(".editing .edit");
    if (edit) edit.focus();
}

export function renderTodoApp() {
    renderTodoList();
    renderStatus();
}

export function mountTodoApp() {
    queueMicrotask(() => {
        const app = document.querySelector(".todoapp");
        if (!app) return;

        cleanups.forEach((done) => done());

        function onHashChange() {
            setRoute(normalizeRoute(location.hash));
        }

        const handleClickOutsideEdit = (event) => {
            if (getEditing() === null) return;
            if (event.target.closest(".edit")) return;
            if (event.target.closest(".editing")) return;
            setEditing(null);
        };

        cleanups = [
            on(app, "keydown", ".new-todo", (event, input) => {
                const title = input.value.trim();
                if (event.key !== "Enter" || !title) return;
                setTodos(getTodos().concat({ id: String(Date.now()), title, completed: false }));
                input.value = "";
            }),
            on(app, "change", ".toggle-all", (event, input) => setTodos(getTodos().map((todo) => ({ ...todo, completed: input.checked })))),
            on(app, "change", ".todo-list .toggle", (event, input) => toggleOne(input)),
            on(app, "click", ".destroy", (event, button) => {
                if (getEditing() !== null) setEditing(null);
                setTodos(getTodos().filter((todo) => todo.id !== idOf(button)));
            }),
            on(app, "dblclick", ".todo-list label", (event, label) => {
                setEditing(idOf(label));
            }),
            on(app, "keydown", ".edit", (event, input) => {
                if (event.key === "Enter") saveEdit(input);
                if (event.key === "Escape") {
                    setEditing(null);
                }
            }),
            on(app, "blur", ".edit", (event, input) => input.closest(".editing") && setEditing(null)),
            on(app, "click", ".todo-list", handleClickOutsideEdit),
            on(app, "click", ".clear-completed", () => setTodos(getTodos().filter((todo) => !todo.completed))),
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
