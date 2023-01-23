<script setup>

import { computed, ref, watch } from 'vue';


/* interface */

const props = defineProps({
  fields: Array,
  target: {},
});

const emit = defineEmits([
  'update:validations',
  'update:isValid',
]);


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


import { getRegisteredElements, getRegisteredTransformers } from './unified-form-registry';
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

    if (!field.width || field.width + currentRowLength > 12) {

      if (currentRowLength > 0) {

        if (currentRowLength < 12) {
          currentRow.push({
            identifier: 'empty',
            width: 12 - currentRowLength,
          });
        }

        result.push(currentRow);

        currentRow = [];
        currentRowLength = 0;

      }

      if (!field.width) {
        result.push([field]);
      }
      else {
        currentRow = [field];
        currentRowLength = field.width;
      }

    }
    else {
      currentRow.push(field);
      currentRowLength += field.width;
    }
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


function handleElementInput(field, input, variant) {

  const element = registeredElements.value.find(it => it.identifier === field.identifier);

  if (element.valueProcessor) {
    input = element.valueProcessor(input, field);
  }


  if (field.variants) {
    input = {
      ...(props.target?.[field.key] ?? {}),
      [variant]: input,
    };
  }


  props.target[field.key] = input;

}


const validations = computed(() => {

  const result = {};


  for (const field of filteredFields.value) {

    if (!field.rules || field.rules.length === 0) {
      continue;
    }


    const fieldValidationResults = [];

    for (const ruler of field.rules) {
      if (typeof ruler === 'object') {

        const matched = matches(ruler.criteria, props.target[field.key]);

        if (!matched) {
          fieldValidationResults.push(ruler.message);
          break;
        }
        else {
          fieldValidationResults.push(true);
        }

      }
      else if (typeof ruler === 'function') {

        const matchResult = ruler(props.target[field.key]);

        fieldValidationResults.push(matchResult);

        if (!matchResult || typeof matchResult === 'string') {
          break;
        }

      }
    }


    result[field.key] = fieldValidationResults;

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


/* template specific */

const gap = ref('12px');

</script>


<template>
  <div class="unified-form">
    <div
      v-for="(fieldRow, index) of rowedFields" :key="index"
      class="row">
      <div
        v-for="field of fieldRow" :key="field.key"
        :class="[ `col-${field.width ?? 12}` ]">

        <template v-if="field.identifier !== 'empty'">
          <component
            :is="registeredElements.find(it => it.identifier === field.identifier).component"
            :field="field"
            :value="props.target[field.key]"
            @input="(input, variant) => handleElementInput(field, input, variant)"
            :success="validations[field.key]?.every(it => it === true)"
            :error="validations[field.key]?.some(it => typeof it === 'string' || it === false)"
            :messages="validations[field.key]?.filter(it => typeof it === 'string')"
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