<script setup>

import { computed, ref, watch } from 'vue';


/* interface */

const props = defineProps({
  fields: Array,
  target: {},
});

const emit = defineEmits([
  'update:validations',
]);


import { getRegisteredElements, getRegisteredTransformers } from '../mod';
import { matches } from 'unified-mongo-filter';

const transformedFields = computed(() => {

  const transformers = getRegisteredTransformers();
  const result = [];


  for (let i = 0; i < props.fields?.length; i++) {

    let field = props.fields[i];

    while (true) {

      const transformer = transformers.find(it => it.criterion(field));
      if (!transformer) break;

      field = transformer.transducer(field);

    }

    result.push(field);

  }


  return result;

});

const filteredFields = computed(() => {
  return transformedFields.value.filter(field =>
    !field.vIf || matches(field.vIf, props.target)
  );
});

const rowedFields = computed(() => {

  const result = [];
  const fields = [...filteredFields.value];


  let currentRow = [];
  let currentRowLength = 0;

  while (fields.length > 0) {

    const field = fields.shift();

    if (!field.width || field.width + currentRowLength > 12) {

      if (currentRowLength < 12) {
        currentRow.push({
          identifier: 'empty',
          width: 12 - currentRowLength
        });
      }

      result.push(currentRow);

      currentRow = [field];
      currentRowLength = field.width ?? 12;

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


function handleElementInput(field, value) {

  const element = registeredElements.value.find(it => it.identifier === field.identifier);

  if (element.valueProcessor) {
    value = element.valueProcessor(value, field);
  }

  props.target[field.key] = value;

}


const validations = computed(() => {

  const result = {};


  for (const field of filteredFields.value) {
    if (!field.rules || field.rules.length === 0) continue;

    const fieldValidationResults = [];


    for (const ruler of field.rules) {
      if (typeof ruler === 'object') {

        const matched = matches(ruler.criteria, props.target[field.key]);

        if (!matched) {
          fieldValidationResults.push(ruler.message);
        }
        else {
          fieldValidationResults.push(true);
        }

      }
      else if (typeof ruler === 'function') {

        const matchResult = ruler(props.target[field.key]);

        fieldValidationResults.push(matchResult);

      }
    }


    result[field.key] = fieldValidationResults;

  }


  return result;

});

watch(validations, () => emit('update:validations', validations.value));


/* template specific */

const padding = ref('12px');
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
            @input="handleElementInput(field, $event)"
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

  .unified-form {
    padding: v-bind(padding);
  }

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