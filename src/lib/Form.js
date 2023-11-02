import { AxiosError } from 'axios';
import { ValidationError } from 'yup';

class Form extends EventTarget {
  constructor(element) {
    super();
    this.$form = element;
    this.$inputs = [
      ...Array.from(this.$form.querySelectorAll('input')),
      ...Array.from(this.$form.querySelectorAll('select'))
    ];
    this.$submit = Array.from(this.$form.querySelectorAll('[type="submit"]'));
    this.$fields = Array.from(this.$form.querySelectorAll('[data-field]'));
    this.addEventListeners();
  }

  addEventListeners() {
    this.$form.addEventListener('submit', (e) => this.handleSubmit(e));
    const schema = this.getSchema();
    this.$inputs.forEach(($input) => {
      $input.addEventListener('blur', async (event) => {
        const { name } = event.target;
        try {
          await schema.pick([name]).validate(this.getData());
          this.setFieldError(name, "");
        } catch (error) {
          this.setFieldError(name, error.message);
        }
      });
    });
  }

  getField(name) {
    return this.$fields.find((f) => f.dataset.field === name);
  }

  getInput(name) {
    return this.$inputs.find(($input) => $input.name === name);
  }

  setFieldError(name, message) {
    const $field = this.$fields.find((f) => f.dataset.field === name);
    const $error = $field.querySelector('[data-field-error]');
    $error.textContent = message;
    $field.setAttribute('data-field-invalid', message !== "");
  }

  resetFieldErrors() {
    this.$fields.forEach(($field) => {
      this.setFieldError($field.dataset.field, "");
    });
  }

  getData() {
    const data = new FormData(this.$form);
    const result = {};
    for (const key of data.keys()) {
      result[key] = data.get(key);
    }
    return result;
  }

  async handleSubmit(event) {
    event.preventDefault();
    const $button = this.$form.querySelector('[type="submit"]');
    const data = this.getData();
    const schema = this.getSchema();
    const { loadingLabel } = $button.dataset;
    const label = $button.textContent;
    try {
      const validatedData = await schema.validate(data, { abortEarly: false });
      this.resetFieldErrors();
      $button.querySelector('[data-text]').textContent = loadingLabel;
      $button.disabled = true;
      if ($button.querySelector('[data-loader]')) {
        $button.querySelector('[data-loader]').style.display = 'inline-block';
      }
      const response = await this.handleSave(validatedData);
      const event = new Event('submitted');
      event.data = { fields: this.getData(), response };
      this.dispatchEvent(event);
    } catch (error) {
      if (error instanceof ValidationError) {
        const { inner } = error;
        this.$fields.forEach(($field) => {
          const { field } = $field.dataset;
          const { message } = (inner || error).find((verr) => verr.path === field) || {};
          this.setFieldError(field, message || "");
        });
      } else if (error instanceof AxiosError) {
        window.trigger('error', error.response.data.error.message);
      } else {
        throw error;
      }
    } finally {
      $button.disabled = false;
      $button.querySelector('[data-text]').textContent = label;
      if ($button.querySelector('[data-loader]')) {
        $button.querySelector('[data-loader]').style.display = 'none';
      }
    }
  }

  getSchema() {
    throw new Error('getSchema must be implemented in super class');
  }

  async handleSave() {
    throw new Error('handleSave must be implemented in super class');
  }
}

export default Form;
