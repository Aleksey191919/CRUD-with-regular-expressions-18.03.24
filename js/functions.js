/** @format */

function showUsers(usersList) {
  const parent = document.querySelector('#grid');
  parent.addEventListener('click', gridClickHandler);

  // dataset data-* (data-attributes)

  usersList.forEach((user) => {
    const userRow = createUserRow(user);
    parent.appendChild(userRow);
  });
}

function createUserRow(user) {
  const userRow = document.createElement('div');
  userRow.classList.add('user_row');
  userRow.classList.add('row');
  userRow.setAttribute('data-id', user.id);

  createUserRowContent(userRow, user);

  return userRow;
}

function createUserRowContent(userRow, user) {
  createElement('div', { className: 'user_id col-sm-1' }, user.id, userRow);
  createElement('div', { className: 'user_name col' }, user.name, userRow);

  const divButtons = createElement(
    'div',
    { className: 'user_buttons col' },
    '',
    userRow
  );
  createElement(
    'input',
    {
      type: 'button',
      value: 'View',
      'data-action': 'view',
      className: 'btn btn-primary',
    },
    '',
    divButtons
  );
  createElement(
    'input',
    {
      type: 'button',
      value: 'Edit',
      'data-action': 'edit',
      className: 'btn btn-warning',
    },
    '',
    divButtons
  );
  createElement(
    'input',
    {
      type: 'button',
      value: 'Delete',
      'data-action': 'delete',
      className: 'btn btn-danger',
    },
    '',
    divButtons
  );
}

function createElement(tagName, attributes, content, parent, eventHandlers) {
  const element = document.createElement(tagName);

  for (let key in attributes) {
    const attribute = key === 'className' ? 'class' : key;
    element.setAttribute(attribute, attributes[key]);
  }

  for (let event in eventHandlers) {
    element.addEventListener(event, eventHandlers[event]);
  }

  element.textContent = content;
  parent.appendChild(element);

  return element;
}

function gridClickHandler(event) {
  if (event.target.nodeName === 'INPUT') {
    const dataAction = event.target.getAttribute('data-action');
    const userId = event.target.closest('.user_row').getAttribute('data-id');

    switch (dataAction) {
      case 'view':
        showUserData(getUserById(userId));
        break;
      case 'edit':
        editUserData(getUserById(userId));
        break;
      case 'delete':
        deleteUser(userId);
        break;
    }
  }
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

function getUserIndexById(id) {
  return users.findIndex((user) => user.id === id);
}

function showUserData(user) {
  document.querySelector('#view').classList.remove('hidden');
  document.querySelector('#view').innerHTML = `
    <div>
      <p>Name: ${user.name}</p>
      <p>Login: ${user.login}</p>
      <p>Email: ${user.email}</p>
      <p>Age: ${user.age}</p>
      <p>Phone: ${user.phone}</p>
      <p>Card number: ${user.cardnumber}</p>
      <input type="button" value="Close" class="view_close_button" />
    </div>
  `;

  document.querySelector('.view_close_button').addEventListener('click', () => {
    document.querySelector('#view').classList.add('hidden');
    document.querySelector('#view').innerHTML = '';
  });
}

function deleteUser(userId) {
  let confirmation;

  const confirmationWindow = window.open('', '_blank', 'width=400,height=200');

  confirmationWindow.document.write(`
      <html>
          <head>
              <title>User deletion confirmation</title>
          </head>
          <body class="confirmation-window">
              <h1>Are you sure you want to delete this user?</h1>
              <button id="yesBtn">Да</button>
              <button id="noBtn">Нет</button>
          </body>
      </html>
  `);

  confirmationWindow.focus();

  confirmationWindow.document
    .getElementById('yesBtn')
    .addEventListener('click', () => {
      confirmation = true;
      confirmationWindow.close();
    });

  confirmationWindow.document
    .getElementById('noBtn')
    .addEventListener('click', () => {
      confirmation = false;
      confirmationWindow.close();
    });

  confirmationWindow.onbeforeunload = () => {
    if (confirmation) {
      const userIndex = getUserIndexById(userId);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        const userRow = document.querySelector(`.row[data-id="${userId}"]`);
        userRow.remove();
        saveUser(users, false);
      }
    }
  };
}
