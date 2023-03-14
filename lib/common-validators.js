import { registerValidator } from './unified-form-registry';


registerValidator({
  key: 'is-number',
  validator: v => !isNaN(v),
});

registerValidator({
  key: 'is-digits',
  validator: v => /^[0-9]*$/.test(v),
});
