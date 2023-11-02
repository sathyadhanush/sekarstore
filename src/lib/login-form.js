import * as Yup from 'yup';
import axios from 'axios';
import Form from './Form';
import { redirect } from './url-utils';

class LoginForm extends Form {
  getSchema() {
    return Yup.object({
      username: Yup.string()
        .email('Please enter a valid email address')
        .required('Please enter email address'),
      password: Yup.string().required('Please enter password'),
    });
  }

  async handleSave(data) {
    const queryParams = new URLSearchParams(location.search);
    await axios.post("/account/login", data);
    redirect(queryParams.get("redirect") || "/account");
  }
}

export default LoginForm;
