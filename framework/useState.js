let state

function useState(initialState) {
    state =  initialState
    
    function setState(newState) {
        state = newState
        updateState()
    }

    return [state, setState]
}

function createComponent() {
    const [count, setCount] = useState(0)
    window.increment = () => setCount(state + 1)
    window.decrement = () => setCount(state - 1)

    return `
        <div>
            <div> chi l3iba<p>Current Count: <p id="count-value">${count}</p></p></div>
            <button onclick="increment()">Increment</button>
            <button onclick="decrement()">Decrement</button>
        </div>
    `;
}

function updateState() {
    const countSpan = document.getElementById('count-value')
    if (countSpan) {
        countSpan.textContent = state
    }
}

function Render() {
    const appDiv = document.getElementById('app')
    appDiv.innerHTML = createComponent()
}

Render()
