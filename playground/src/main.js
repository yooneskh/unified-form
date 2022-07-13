import { createApp, defineAsyncComponent } from 'vue';
const app = createApp(App);


import { registerFormElement, registerTransformer } from '../../mod';


app.component('unified-form', defineAsyncComponent(() => import('../../lib/unified-form.vue')));


import ElementText from './components/element-text.vue';

registerFormElement({
  identifier: 'text',
  component: ElementText,
  valueProcessor: (v, f) => f.type === 'number' ? Number(v) : v,
});

registerTransformer({
  criterion: f => f.identifier === 'number',
  transducer: f => ({
    ...f,
    identifier: 'text',
    type: 'number',
  })
});


import ElementTextarea from './components/element-textarea.vue';

registerFormElement({
  identifier: 'textarea',
  component: ElementTextarea,
});


registerFormElement({
  identifier: 'checkbox',
  component: defineAsyncComponent(() => import('./components/element-checkbox.vue')),
});


registerFormElement({
  identifier: 'checkbox',
  component: defineAsyncComponent(() => import('./components/element-checkbox.vue')),
});


registerFormElement({
  identifier: 'checkboxes',
  component: defineAsyncComponent(() => import('./components/element-checkboxes.vue')),
});


import App from './app.vue';
app.mount('#app');
