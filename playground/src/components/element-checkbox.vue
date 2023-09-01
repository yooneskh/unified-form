<script setup>

import { computed } from 'vue';

const props = defineProps({
  modelValue: {},
  field: {},
});

const emit = defineEmits([
  'update:modelValue',
]);


const valueProxy = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

</script>


<template>
  <div style="padding: 8px;">

    <label>

      <input
        type="checkbox"
        v-model="valueProxy"
      />

      {{ props.field.label }}

    </label>

  </div>
</template>