<script setup>


import { ref } from 'vue';

const target = ref({
  firstName: 'Yoones',
  age: 22,
  address: 'New York!'
});

const validations = ref({});

</script>


<template>
  <div style="padding: 0 64px 64px;">

    <unified-form
      :target="target"
      v-model:validations="validations"
      :fields="[
        {
          key: 'firstName', identifier: 'text', label: 'First Name', width: 6,
          rules: [
            v => v === 'Hello' || 'First name must be hello!',
            {
              criteria: { $ne: 'Bye' },
              message: 'First name must not be Bye!'
            },
          ]
        },
        {
          key: 'lastName', identifier: 'text', label: 'Last Name', width: 6,
        },
        {
          key: 'email', identifier: 'text', label: 'Email', width: 6,
        },
        {
          key: 'age', identifier: 'number', label: 'Age', width: 6,
          rules: [
            v => v < 18 || 'Age must be less than 19',
            v => v > 3 || 'Age must be less than 19',
          ]
        },
        {
          vIf: { age: { $gte: 18 } },
          key: 'address', identifier: 'textarea', label: 'Address', width: 12,
          rows: 8,
        },
        {
          key: 'acceptance', identifier: 'checkbox', label: 'Agree to terms and conditions',
        },
        {
          vIf: { acceptance: true },
          key: 'services', identifier: 'checkboxes', label: 'Services',
          items: [
            { value: 'home1', title: 'Home 1' },
            { value: 'home2', title: 'Home 2' },
            { value: 'home3', title: 'Home 3' },
          ]
        },
      ]"
    />

    <div style="margin-top: 16px;">
      <pre>{{ target }}</pre>
    </div>

    <div style="margin-top: 16px;">
      <pre>{{ validations }}</pre>
    </div>

  </div>
</template>
