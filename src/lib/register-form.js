import * as Yup from 'yup';
import axios from 'axios';
import Form from './Form';
import { redirect } from './url-utils';

class RegisterForm extends Form {
  getSchema() {
    return Yup.object({
      first_name: Yup.string().max(50, 'First name cannot be more than 50 characters')
        .required('First name cannot be empty'),
      last_name: Yup.string().max(50, 'Last name cannot be more than 50 characters'),
      email: Yup.string().email('Please enter a valid email address')
        .required('Please enter email address'),
      password: Yup.string().required('Please enter password'),
    });
  }

  async handleSave(data) {
    const queryParams = new URLSearchParams(location.search);
    await axios.post("/account/register", data);
    redirect(queryParams.get("redirect") || "/account");
  }
}

export default RegisterForm;
