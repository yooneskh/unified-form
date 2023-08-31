<script setup>

import { ref } from 'vue';


const target = ref({
  firstName: 'Yoones',
  age: 22,
  address: 'New York!'
});

const validations = ref({});
const isValid = ref(true);

</script>


<template>
  <div style="padding: 0 64px 64px;">

    <unified-form
      :target="target"
      @update:validations="validations = $event"
      @update:isValid="isValid = $event"
      :fields="[
        {
          key: 'firstName', identifier: 'text', label: 'First Name', preemptWidth: 6,
          rules: [
            {
              criteria: { $ne: 'Bye' },
              message: 'First name must not be Bye!'
            },
            v => v === 'Hello' || 'First name must be hello!',
          ]
        },
        {
          key: 'lastName', identifier: 'text', label: 'Last Name', preemptWidth: 6,
        },
        {
          key: 'email', identifier: 'text', label: 'Email', width: 6,
        },
        {
          key: 'age', identifier: 'number', label: 'Age', width: 6,
          rules: [
            v => v < 19 || 'Age must be less than 19',
            v => v > 3 || 'Age must be more than 3',
          ],
        },
        {
          key: 'previousAge', identifier: 'text', label: 'Previous Age', width: 6,
          rules: [
            ['is-digits', 'You must only enter digits']
          ],
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
      <pre>{{ { isValid, validations } }}</pre>
    </div>

  </div>
</template>
