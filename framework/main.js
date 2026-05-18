/**
 * this function is made to create any element html based on the type of it and props and childrens.
 * 
 * @param {string|Function|HTMLElement} type 
 * @param {Object|null} props 
 * @param  {...any} children 
 * @returns {HTMLElement}
 */
export function createElement(type, props, ...children) {
    if (typeof type === "function") return createElement(type());
    if (type instanceof HTMLElement) return type;
    
    let ele = document.createElement(type);
    if (props) for (let key in props) ele[key] = props[key];;
    
    ele.append(...children);
    return ele;
}