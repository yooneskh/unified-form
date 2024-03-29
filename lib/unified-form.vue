<script setup>

import { computed, ref, reactive, watch, inject, toValue } from 'vue';


/* interface */

const props = defineProps({
  fields: Array,
  target: {},
  validationStrategy: {
    type: String,
    default: 'dirty',
  },
  gap: {
    type: [Number, String],
    default: '12px',
  },
});

const emit = defineEmits([
  'update:validations',
  'update:isValid',
]);


/* breakpoints */

import { useWindowSize } from './use-window-size';
const { width: windowWidth } = useWindowSize();

 
const globalBreakpoints = inject('globalBreakpoints', {
  'xs': 640,
  'sm': 768,
  'md': 1024,
  'lg': 1280,
  'xl': 1536,
});


const currentBreakpoint = computed(() => {

  const breakpoints = toValue(globalBreakpoints);

  for (const key in breakpoints) {
    if (windowWidth.value < breakpoints[key]) {
      return key;
    }
  }

  return '2xl';

});


function getColsFor(field) {

  if (field.identifier === 'empty') {
    return field.width;
  }

  if (field.preemptWidth) {
    return field.preemptWidth;
  }

  if (currentBreakpoint.value === 'xs') {
    return field.width?.xs ?? 12;
  }

  return field.width?.[currentBreakpoint.value] ?? field.width ?? 12;

}


/* fields */

const memoizedFields = ref([]);

const fields = computed(() => (
  props.fields ?? []
));


watch(fields, () => {
  if (JSON.stringify(fields.value) !== JSON.stringify(memoizedFields.value)) {
    memoizedFields.value = fields.value;
  }
}, { immediate: true });


import { getRegisteredElements, getRegisteredTransformers , getRegisteredValidators, getRegisteredValueProcessors } from './unified-form-registry';
import { matches } from 'unified-mongo-filter';

const transformers = computed(() => (
  getRegisteredTransformers()
));


const transformedFields = computed(() => {

  const result = [];


  for (let i = 0; i < memoizedFields.value.length; i++) {

    let field = memoizedFields.value[i];

    while (true) {

      const transformer = transformers.value.find(it => it.criterion(field));
      if (!transformer) break;

      field = transformer.transducer(field);

    }

    result.push(field);

  }


  return result;

});

const filteredFields = computed(() =>
  transformedFields.value.filter(field =>
    !field.vIf || matches(field.vIf, props.target)
  )
);

const rowedFields = computed(() => {

  const result = [];

  let currentRow = [];
  let currentRowLength = 0;

  for (const field of filteredFields.value) {

    const fieldWidth = getColsFor(field);


    if (currentRowLength + fieldWidth <= 12) {
      currentRow.push(field);
      currentRowLength += fieldWidth;
      continue;
    }


    if (currentRowLength < 12 && currentRowLength > 0) {
      currentRow.push({
        identifier: 'empty',
        width: 12 - currentRowLength,
      });
    }


    result.push(currentRow);

    currentRow = [field];
    currentRowLength = fieldWidth;

  }


  if (currentRowLength > 0) {

    if (currentRowLength < 12) {
      currentRow.push({
        identifier: 'empty',
        width: 12 - currentRowLength
      });
    }

    result.push(currentRow);

  }


  return result;

});


const registeredElements = computed(() =>
  getRegisteredElements()
);

const registeredValueProcessors = computed(() =>
  getRegisteredValueProcessors()
);


const dirtyFields = reactive({});

function handleElementInput(field, input, variant) {

  const element = registeredElements.value.find(it => it.identifier === field.identifier);

  for (const item of registeredValueProcessors.value) {
    if (item.criterion(element, input)) {
      input = item.processor(input, field);
    }
  }


  if (field.variants) {
    input = {
      ...(props.target?.[field.key] ?? {}),
      [variant]: input,
    };
  }


  props.target[field.key] = input;

  dirtyFields[field.key] = true;

}


const internalValidations = reactive({});

const validators = computed(() =>
  getRegisteredValidators()
);

const validations = computed(() => {

  const result = {};

  for (const field of filteredFields.value) {
    
    const fieldValidationResults = [];


    if (field.key in internalValidations) {
      fieldValidationResults.push(internalValidations[field.key]);
    }


    if (field.rules?.length > 0) {
      for (const ruler of field.rules) {
        if (typeof ruler === 'function') {
  
          const matchResult = ruler(props.target[field.key]);
  
          fieldValidationResults.push(matchResult);
  
          if (!matchResult || typeof matchResult === 'string') {
            break;
          }
  
        }
        else if (typeof ruler === 'string') {
  
          const validator = validators.value.find(it => it.key === ruler);
  
          if (!validator) {
            console.warn(`${ruler} validator was used but was not registered.`);
            continue;
          }
  
          const matchResult = validator.validator(props.target[field.key]);
  
          fieldValidationResults.push(matchResult);
  
          if (!matchResult || typeof matchResult === 'string') {
            break;
          }
  
        }
        else if (Array.isArray(ruler)) {
  
          if (ruler.length !== 2 || typeof ruler[0] !== 'string' || typeof ruler[1] !== 'string') {
            console.warn('array rules must be two elements and both be strings. this was given', ruler);
            break;
          }
  
  
          const validator = validators.value.find(it => it.key === ruler[0]);
  
          if (!validator) {
            console.warn(`${ruler[0]} validator was used but was not registered.`);
            continue;
          }
  
          const matchResult = validator.validator(props.target[field.key]);
  
          if (!matchResult || typeof matchResult === 'string') {
            fieldValidationResults.push(ruler[1]);
            break;
          }
  
          fieldValidationResults.push(matchResult);
  
        }
        else if (typeof ruler === 'object') {
  
          const matched = matches(ruler.criteria, props.target[field.key]);
  
          if (!matched) {
            fieldValidationResults.push(ruler.message);
            break;
          }
          else {
            fieldValidationResults.push(true);
          }
  
        }
      }
    }


    if (fieldValidationResults.length > 0) {
      result[field.key] = fieldValidationResults;
    }

  }


  return result;

});

watch(validations, () => (
  emit('update:validations', validations.value)
), { immediate: true });


const isValid = computed(() => (
  Object.keys(validations.value).every(key => (
    validations.value[key].every(it => it  === true)
  ))
));

watch(isValid, () => (
  emit('update:isValid', isValid.value)
), { immediate: true });


/* template */

const gap = computed(() =>
  !isNaN(props.gap) ? `${props.gap}px` : props.gap
);


</script>


<template>
  <div class="unified-form">
    <div
      v-for="(fieldRow, index) of rowedFields" :key="index"
      class="row">
      <div
        v-for="field of fieldRow" :key="field.key"
        :class="[ `col-${getColsFor(field)}` ]">

        <template v-if="field.identifier !== 'empty'">
          <component
            :is="registeredElements.find(it => it.identifier === field.identifier).component"
            :field="field"
            :model-value="props.target[field.key]"
            @update:model-value="(input, variant) => handleElementInput(field, input, variant)"
            @update:is-valid="internalValidations[field.key] = $event"
            :success="validations[field.key]?.every(it => it === true)"
            :error="(props.validationStrategy !== 'dirty' || dirtyFields[field.key]) && validations[field.key]?.some(it => typeof it === 'string' || it === false)"
            :messages="(props.validationStrategy !== 'dirty' || dirtyFields[field.key]) ? validations[field.key]?.filter(it => typeof it === 'string') : []"
          />
        </template>

      </div>
    </div>
  </div>
</template>


<style scoped>

  .row {
    display: flex;
    flex-direction: row;
    gap: v-bind(gap);
  }

  .row + .row {
    margin-top: v-bind(gap);
  }

  .row > * {
    width: 0;
  }

  .col-1  { flex-basis: calc(100% * (1  / 12)); }
  .col-2  { flex-basis: calc(100% * (2  / 12)); }
  .col-3  { flex-basis: calc(100% * (3  / 12)); }
  .col-4  { flex-basis: calc(100% * (4  / 12)); }
  .col-5  { flex-basis: calc(100% * (5  / 12)); }
  .col-6  { flex-basis: calc(100% * (6  / 12)); }
  .col-7  { flex-basis: calc(100% * (7  / 12)); }
  .col-8  { flex-basis: calc(100% * (8  / 12)); }
  .col-9  { flex-basis: calc(100% * (9  / 12)); }
  .col-10 { flex-basis: calc(100% * (10 / 12)); }
  .col-11 { flex-basis: calc(100% * (11 / 12)); }
  .col-12 { flex-basis: calc(100% * (12 / 12)); }

</style>