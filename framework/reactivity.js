const effectStack = [];
let activeEffect = null;

export function createSignal(initialValue) {
   let value = initialValue;
   const effects = new Set();

   const Read = () => {
      if (activeEffect) {
         effects.add(activeEffect);
         activeEffect.deps.add(effects);
      }
      return value;
   }

   const Write = (newValue) => {
      if (value === newValue) return;
      value = newValue;
      const effectsCopy = new Set(effects);

      effectsCopy.forEach(effectObj => effectObj.execute());
   }

   return [Read, Write];
}

export function createEffect(effect) {
   const currentEffect = {
      execute: () => {
         Cleanup(currentEffect);
         effectStack.push(currentEffect);
         activeEffect = currentEffect;
         try {
            effect();
         } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1] || null;
         }
      },
      deps: new Set()
   }
   currentEffect.execute()


}

export function Cleanup(effectObj) {
   for (const signal of effectObj.deps) {
      signal.delete(effectObj);
   }
   effectObj.deps.clear()
}