# Unified Form
Streamline your Form management in a single place. Add abilities to your forms globally and then easily use them in multiple places.

```vue
<script setup>

import { defineAsyncComponent, reactive } from 'vue';
import { registerFormElement, registerTransformer, appendValueProcessor } from 'unified-form';

import ElementText from './components/element-text.vue';

registerFormElement({
  identifier: 'text',
  component: ElementText,
  valueProcessor: (v, f) => f.type === 'number' ? Number(v) : v,
});

appendValueProcessor({
  criterion: f => f.type === 'number',
  processor: v => Number(v),
});

registerTransformer({
  criterion: f => f.identifier === 'number',
  transducer: f => ({
    ...f,
    identifier: 'text',
    type: 'number',
  })
});


registerFormElement({
  identifier: 'checkbox',
  component: defineAsyncComponent(() => import('./components/element-checkbox.vue')),
});


const formData = reactive({
  name: 'initial value for name',
});

</script>

<template>
  <unified-form
    :target="formData"
    :fields="[
      {
        key: 'firstName', identifier: 'text', label: 'First Name', width: 6,
        rules: [
          {
            criteria: { $ne: 'Bye' },
            message: 'First name must not be Bye!'
          },
          v => v === 'Hello' || 'First name must be hello!',
        ]
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
</template>
```