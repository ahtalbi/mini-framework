export function createElement(type, props, ...children) {
    if (typeof type === "function") {
        return type({ ...(props || {}), children });
    }

    if (type instanceof HTMLElement) return type;
    let ele = document.createElement(type);
    for (let key in props || {}) {
        ele[key] = props[key];
    }
    ele.append(...children);
    return ele;
}

export function render(element, container) {
    container.replaceChildren(element);
}
