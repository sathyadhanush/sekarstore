import Form from "./Form";
import Page from "./page";
import * as Yup from 'yup';

class ForgotPasswordForm extends Form {
    getSchema() {
        return Yup.object({
            username: Yup.string()
                .email('Please enter a valid email address')
                .required('Please enter email address'),
        });
    }

    async handleSave(data) {
        const response = await axios.post("/account/verify", { login_id: data.username });
        return response.data.data;
    }
}

class ResetPasswordForm extends Form {
    getSchema() {
        return Yup.object({
            username: Yup.string().required(),
            verificationId: Yup.string().required(),
            verificationCode: Yup.string()
                .length(4, 'Plesse enter valid OTP')
                .required('Please enter the OTP'),
            password: Yup.string().required('Please enter new password'),
            confirmPassword: Yup.string().required('Please enter confirm password')
                .when('password', ([password], schema) => {
                    return  schema.test({
                        test: (value) => value === password,
                        message: 'New Password and Confirm password does not match'
                    })
                }),
        });
    }

    async handleSave(data) {
        const response = await axios.post("/account/reset-password", { 
            verification_id: data.verificationId,
            verification_code: data.verificationCode,
            login_id: data.username,
            password: data.password,
        });
        return response.data.data;
    }
}

class ForgotPasswordPage extends Page {
    constructor() {
        super();
        this.formInstances = {
            forgot: new ForgotPasswordForm(this.$sections.forgot),
            reset: new ResetPasswordForm(this.$sections.reset),
        };
        this.addEventListeners();
        this.switchSection('forgot');
    }

    addEventListeners() {
        this.formInstances.forgot.addEventListener('submitted', (event) => {
            const { response, fields } = event.data;
            const $email = this.$forms.reset.querySelector('[data-placeholder="email"]');
            $email.textContent = fields.username;
            this.formInstances.reset.getInput('username').value = fields.username;
            this.formInstances.reset.getInput('verificationId').value = response.id;
            this.switchSection('reset');
        });

        this.formInstances.reset.addEventListener('submitted', () => {
            this.switchSection('success');
        });
    }
}

export default ForgotPasswordPage;
