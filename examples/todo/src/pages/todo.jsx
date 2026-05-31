import { createElement } from "../../../../framework/dom";
import Footer from "../components/footer";
import Header from "../components/header";

function TodoMVC() {
    return (
        <section class="todoapp">
            <Header />
            <p>list</p>
            <Footer />
        </section>
    )
}

export default TodoMVC;
