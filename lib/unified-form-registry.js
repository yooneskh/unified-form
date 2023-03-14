import { markRaw } from 'vue';


const registeredElements = [];

export function registerFormElement({ identifier, component, valueProcessor }) {
  registeredElements.push({
    identifier,
    component: markRaw(component),
    valueProcessor,
  });
}

export function getRegisteredElements() {
  return registeredElements;
}


const registeredTransformers = [];

export function registerTransformer({ criterion, transducer }) {
  registeredTransformers.push({
    criterion,
    transducer,
  });
}

export function getRegisteredTransformers() {
  return registeredTransformers;
}


const registeredValidators = [];

export function registerValidator({ key, validator }) {
  registeredValidators.push({
    key,
    validator,
  });
}

export function getRegisteredValidators() {
  return registeredValidators;
}
