<script setup>

import { computed } from 'vue';

const props = defineProps({
  value: {},
  field: {},
});

const emit = defineEmits([
  'input',
]);


const valueProxy = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit('input', value);
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