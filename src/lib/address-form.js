import * as Yup from 'yup';
import axios from 'axios';
import Form from './Form';

class AddressForm extends Form {
  getSchema() {
    return Yup.object({
      default: Yup.boolean(),
      id: Yup.string(),
      first_name: Yup.string().max(50, 'First name cannot be more than 50 characters').required('First name is a required field'),
      last_name: Yup.string().max(50, 'Last name cannot be more than 50 characters'),
      city: Yup.string().max(50, 'City cannot be more than 50 characters').required(),
      country: Yup.string().required().max(2),
      state: Yup.string().required(),
      address1: Yup.string().max(50, 'Address cannot be more than 50 characters').required('Address is a required field'),
      address2: Yup.string(),
      mobile: Yup.string()
      .matches(/^[0-9]+$/, 'Mobile number should only contain numbers')
      .max(15, 'Mobile number cannot be more than 15 numbers')
      .required('Mobile number is a required field'),
      zip: Yup.string().max(15,'Zip code cannot be more than 15 numbers').required('Zip code is a required field'),
    });
  }

  async handleSave(data) {
    if (data.id) {
      await axios.put(`/account/addresses/${data.id}`, data);
    } else {
      await axios.post("/account/addresses", data);
    }
    window.location.reload();
  }
}

export default AddressForm;
