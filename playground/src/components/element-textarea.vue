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