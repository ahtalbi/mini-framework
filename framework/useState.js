const hooks = []
let hookIndex = 0

function useState(initialState) {
    const currentIndex = hookIndex

    if (hooks[currentIndex] === undefined) {
        hooks[currentIndex] = initialState
    }

    function setState(value) {
        hooks[currentIndex] =
            typeof value === "function"
                ? value(hooks[currentIndex])
                : value

        Render()
    }

    hookIndex++

    return [
        hooks[currentIndex],
        setState
    ]
}

function createComponent() {
    const [count, setCount] = useState(0)
    const [name, setName] = useState("Ahmed")

    window.increment = () => {
        setCount(prev => prev + 1)
        setName(() => "Simo")
    }

    window.decrement = () => {
        setCount(prev => prev - 1)
        setName(() => "Othmane")
    }

    return `
    ${count}
    ${name}
    <br><br>
  `
}

function Render() {
    hookIndex = 0

    document.getElementById("app").innerHTML =
        createComponent()
}

Render()
