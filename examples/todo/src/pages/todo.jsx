import { createElement } from "../../../../framework/dom";
import Footer from "../components/footer";
import Header from "../components/header";

function TodoMVC() {
    return (
        <section class="todoapp">
            <Header />
            <main class="main">
                <div class="toggle-all-container">
                    <input class="toggle-all" type="checkbox" id="toggle-all" />
                    <label class="toggle-all-label" for="toggle-all">Toggle All Input</label>
                </div>
                <ul class="todo-list"></ul>
            </main>
            <Footer />
        </section>
    )
}

export default TodoMVC;
