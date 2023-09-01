<script setup>

import { ref } from 'vue';

const props = defineProps({
  modelValue: {},
  field: {},
  success: Boolean,
  error: Boolean,
  messages: Array,
});


const emit = defineEmits([
  'update:modelValue'
]);

</script>


<template>
  <div style="padding: 8px;">

    <div :style="{ 'color': props.success ? 'green' : (props.error ? 'red' : undefined ) }">
      {{ props.field.label }}
    </div>

    <input
      :type="props.field.type || 'text'"
      :model-value="props.modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      style="display: block; width: 100%; padding: 8px; margin-top: 8px; box-sizing: border-box;"
    />

    <div v-if="props.error" style="color: red; margin-top: 8px;">
      {{ props.messages.join(' - ') }}
    </div>

  </div>
</template>