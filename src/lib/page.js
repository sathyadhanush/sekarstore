import { camelCase } from 'lodash';

class Page {
    constructor() {
        this.store = {};
        this.$forms = {};
        this.$sections = {};
        document.body.querySelectorAll('[data-section]').forEach(($element) => {
            const id = camelCase($element.dataset.section);
            this.$forms[id] = $element;
            this.$sections[id] = $element;
        });
    }

    switchSection(sectionName) {
        for (const name in this.$forms) {
            const $form = this.$forms[name];
            if (name === sectionName) {
                $form.style.display = 'block';
            } else {
                $form.style.display = 'none';
            }
        }
    }
}

export default Page;
