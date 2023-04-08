export {
  default as default
} from './lib/unified-form.vue';

export {
  registerFormElement,
  getRegisteredElements,
  registerTransformer,
  getRegisteredTransformers,
  registerValidator,
  getRegisteredValidators,
  prependValueProcessor,
  appendValueProcessor,
  getRegisteredValueProcessors,
} from './lib/unified-form-registry';


import './lib/common-validators.js'