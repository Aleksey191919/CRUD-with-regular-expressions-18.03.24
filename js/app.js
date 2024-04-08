// TBD: update when localStorage integrated
const users = JSON.parse(localStorage.getItem('users')) || defaultUsers;

document.addEventListener('DOMContentLoaded', () => {
  showUsers(users);
});

document.querySelector('.add_btn').addEventListener('click', () => {
  document.querySelector('#form').classList.remove('hidden');
});



