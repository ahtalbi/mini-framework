export function on(root, type, selector, handler) {
    const listener = (event) => {
        const target = event.target.closest(selector);
        if (target && root.contains(target)) handler(event, target);
    };

    root.addEventListener(type, listener);
    return () => root.removeEventListener(type, listener);
}