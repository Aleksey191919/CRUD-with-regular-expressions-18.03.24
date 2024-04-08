/** @format */

document.querySelector('.save_btn').addEventListener('click', (event) => {
  const user = collectData();
  const isValid = validateUser(user);

  if (!isValid) {
    // alert('Введите корректные данные!');
    return; // Прерываем выполнение кода, если данные невалидны
  }

  const id = event.target.getAttribute('data-id');

  if (!id) {
    user.id = getNextUserId();
    saveUser(user);
    const parent = document.querySelector('#grid');
    const userRow = createUserRow(user);
    parent.appendChild(userRow);
  } else {
    user.id = id;
    const userIndex = getUserIndexById(id);
    if (userIndex === -1) {
      return;
    }

    users[userIndex] = user;

    const userRow = document.querySelector(`.row[data-id="${id}"]`);
    userRow.innerHTML = '';
    createUserRowContent(userRow, user);
    saveUser(user, false);
  }

  clearFormData();
  document.querySelector('#form').classList.add('hidden');
});

function clearFormData() {
  const formElements = document.forms[0].elements;
  for (let item of formElements) {
    if (item.type === 'button') {
      item.removeAttribute('data-id');
    } else {
      item.value = '';
    }
  }
}

function editUserData(user) {
  document.querySelector('#form').classList.remove('hidden');

  const formElements = document.forms[0].elements;
  formElements.save_btn.setAttribute('data-id', user.id);

  for (let key in user) {
    if (key === 'id') {
      continue;
    }
    formElements[key].value = user[key];
  }
}

function collectData() {
  const form = document.forms[0].elements;
  const name = form.name.value;
  const login = form.login.value;
  const age = form.age.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const cardnumber = form.cardnumber.value;

  const user = {
    name,
    login,
    age,
    email,
    phone,
    cardnumber,
  };
  console.log(user);
  return user;
}

function validateUser(user) {
  const patternName = /^[A-ZА-ЯІЇЄ]{1}[a-zа-яіїє]{2,}$/;
  const patternEmail = /^.{2,}@[a-z]{2,}\.[a-z]{2,}$/;
  const patternPhoneNumber = /^\d{10}$/;
  const patternAge = /^(0?[1-9]|[1-9][0-9])$/;
  const patternCardNumber = /^\d{16}$/;
  let isValid = true;

  for (let value in user) {
    if (user[value] === '') {
      isValid = false;
      break;
    }
  }

  const nameInput = document.querySelector("input[name='name']");
  const emailInput = document.querySelector("input[name='email']");
  const phoneInput = document.querySelector("input[name='phone']");
  const ageInput = document.querySelector("input[name='age']");
  const cardNumberInput = document.querySelector("input[name='cardnumber']");

  const nameErrorMessage = document.getElementById('name_error');
  const emailErrorMessage = document.getElementById('email_error');
  const phoneErrorMessage = document.getElementById('phone_error');
  const ageErrorMessage = document.getElementById('age_error');
  const cardNumberErrorMessage = document.getElementById('cardnumber_error');

  if (!patternName.test(nameInput.value.trim())) {
    nameErrorMessage.textContent = 'Invalid name';
    isValid = false;
  } else {
    nameErrorMessage.textContent = '';
  }

  if (!patternEmail.test(emailInput.value.trim())) {
    emailErrorMessage.textContent = 'Invalid email';
    isValid = false;
  } else {
    emailErrorMessage.textContent = '';
  }

  if (!patternPhoneNumber.test(phoneInput.value.trim())) {
    phoneErrorMessage.textContent = 'Invalid phone number';
    isValid = false;
  } else {
    phoneErrorMessage.textContent = '';
  }

  if (!patternAge.test(ageInput.value.trim())) {
    ageErrorMessage.textContent = 'Invalid age';
    isValid = false;
  } else {
    ageErrorMessage.textContent = '';
  }

  if (!patternCardNumber.test(cardNumberInput.value.trim())) {
    cardNumberErrorMessage.textContent = 'Invalid card number';
    isValid = false;
  } else {
    cardNumberErrorMessage.textContent = '';
  }

  return isValid;
}

function generateUserId() {
  let latestUserId =
    parseInt(localStorage.getItem('latestUserId')) || defaultUsers.length + 1;

  return function () {
    localStorage.setItem('latestUserId', latestUserId.toString());
    return (latestUserId++).toString();
  };
}

const getNextUserId = generateUserId();
const newUserId = getNextUserId();

function saveUser(user, isNew = true) {
  if (isNew) {
    users.push(user);
  }
  localStorage.setItem('users', JSON.stringify(users));
}
