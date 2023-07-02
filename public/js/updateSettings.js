/* eslint-disable */
import { showAlert } from './alert.js';

export const updateSettings = async (data, type) => {
  // type is either 'data' or 'password'
  try {
    let url;
    let method = 'PATCH';
    switch (type) {
      case 'password':
        // url = 'http://127.0.0.1:8000/api/v1/users/updateMyPassword';
        url = '/api/v1/users/updateMyPassword';
        break;
      case 'data':
        // url = 'http://127.0.0.1:8000/api/v1/users/updateMe';
        url = '/api/v1/users/updateMe';
        break;
      case 'signup':
        // url = 'http://127.0.0.1:8000/api/v1/users/signup';
        url = '/api/v1/users/signup';
        method = 'POST';
        break;
      default:
        showAlert('error', 'Type error');
        return;
    }
    // url =
    //   type === 'password'
    //     ? 'http://127.0.0.1:8000/api/v1/users/updateMyPassword'
    //     : 'http://127.0.0.1:8000/api/v1/users/updateMe';
    // console.log(type);
    // console.log(url);
    // console.log(`this is the data: ${data}`);

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      location.reload(true);
    }
  } catch (err) {
    console.log(`Error Response : ${err.response.data}`);
    showAlert('error', err);
  }
};
