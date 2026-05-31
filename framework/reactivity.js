const effectStack = [];
let activEffect = null;

export function createSignal(initialValue) {
   let value = initialValue;
   const effects = new Set();

   const Read = () => {
      if (activEffect) {
         effects.add(activEffect);
      }
      return value;
   }

   const Write = (newValue) => {
      value = newValue;
      effects.forEach(effect => effect());
   }

   return [Read, Write];
}

export function createEffect(effect) {
   effectStack.push(effect);
   activEffect = effect;
   effect();
   effectStack.pop();
   activEffect = effectStack[effectStack.length - 1] || null;
}