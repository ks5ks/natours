/* eslint-disable */
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';

// if this is the login page, listen for the event
if (document.URL.includes('login')) {
  document.querySelector('.form--login').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

// map creation
import { displayMap } from './leaflet.js';
if (document.getElementById('map')) {
  const start = JSON.parse(document.getElementById('start').dataset.start);
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(start, locations);
}

// logout button processing
const logoutBtn = document.querySelector('.nav__el--logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// preview the photo
// const previewPhotoElement = document.getElementById('photo');
// if (previewPhotoElement) {
//   console.log('ready to check for photo change');
//   previewPhotoElement.addEventListener('change', async (e) => {
//     e.preventDefault();
//     req.file.filename = document.getElementById('photo').files[0];
//     console.log(previewPhotoFile);
//     const newImage = await resizePreviewPhoto(req, res);

//     if (newImage) {
//       document
//         .querySelector('.form_user-photo')
//         .setAttribute('src', '/img/users/${newImage');
//     }
//   });
// }

// update settings
const updateDataForm = document.querySelector('.form-user-data');
if (updateDataForm) {
  updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-settings').textContent = 'Uploading ...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');
    document.querySelector('.btn--save-settings').textContent = 'Save settings';
  });
}

// update password
const userPasswordForm = document.querySelector('.form-user-password');
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-password').textContent = 'Updating';
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    );

    document.getElementById('password-current').textContent = '';
    document.getElementById('password').textContent = '';
    document.getElementById('password-confirm').textContent = '';
    document.querySelector('.btn-save-password').textContent = 'SAVE PASSWORD';
  });
}

// signup an account
const signupForm = document.querySelector('.form-signup-data');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-signup').textContent = 'Uploading ...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    // form.append('photo', document.getElementById('photo').files[0]);
    form.append('password', document.getElementById('password').value);
    form.append(
      'passwordConfirm',
      document.getElementById('password-confirm').value
    );

    await updateSettings(form, 'signup');
    document.querySelector('.btn-save-signup').textContent = 'Save settings';
  });
}

// setup to book tour
const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.textContent = 'Processing';

    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
