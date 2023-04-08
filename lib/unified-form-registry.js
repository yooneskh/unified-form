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


const registeredValueProcessors = [];

export function appendValueProcessor({ criterion, processor }) {
  registeredValueProcessors.push({
    criterion,
    processor,
  });
}

export function prependValueProcessor({ criterion, processor }) {
  registeredValueProcessors.unshift({
    criterion,
    processor,
  });
}

export function getRegisteredValueProcessors() {
  return registeredValueProcessors;
}
