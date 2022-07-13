<script setup>

const props = defineProps({
  value: {},
  field: {},
});

const emit = defineEmits([
  'input',
]);



function toggleValue(value) {

  if (!props.value) {
    emit('input', [value]);
  }
  else if (props.value.includes(value)) {
    emit('input', props.value.filter(it => it !== value));
  }
  else {
    emit('input', [...props.value, value]);
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
          :checked="value?.includes(item.value)"
        />

        {{ item.title }}

      </div>
    </div>

  </div>
</template>