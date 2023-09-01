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

    <div>
      {{ props.field.label }}
    </div>

    <textarea
      v-model="valueProxy"
      :rows="props.field.rows"
      style="width: 100%; padding: 8px; margin-top: 8px; box-sizing: border-box;"
    />

  </div>
</template>