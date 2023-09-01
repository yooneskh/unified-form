<script setup>

const props = defineProps({
  modelValue: {},
  field: {},
});

const emit = defineEmits([
  'update:modelValue',
]);



function toggleValue(value) {

  if (!props.modelValue) {
    emit('update:modelValue', [value]);
  }
  else if (props.modelValue.includes(value)) {
    emit('update:modelValue', props.modelValue.filter(it => it !== value));
  }
  else {
    emit('update:modelValue', [...props.modelValue, value]);
  }

}

</script>


<template>
  <div style="padding: 8px;">

    <label>
      {{ props.field.label }}
    </label>

    <div v-for="item of props.field.items" :key="item.value">
      <div @click="toggleValue(item.value)" style="cursor: pointer;">

        <input
          type="checkbox"
          :checked="props.modelValue?.includes(item.value)"
        />

        {{ item.title }}

      </div>
    </div>

  </div>
</template>