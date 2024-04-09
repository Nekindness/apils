document.addEventListener('DOMContentLoaded', function() {
  const catList = document.getElementById('catList');
  const addCatForm = document.getElementById('addCatForm');
  const editModal = document.getElementById('editModal');
  const db = 'username'; // Уникальное имя пользователя

  // Функция для загрузки всех котиков при загрузке страницы
  function loadCats() {
    fetch(`https://cats.petiteweb.dev/api/single/db/show`)
      .then(response => response.json())
      .then(data => {
        catList.innerHTML = ''; // Очистить список перед загрузкой

        data.forEach(cat => {
          const catCard = createCatCard(cat);
          catList.appendChild(catCard);
        });
      })
      .catch(error => console.error('Ошибка при загрузке котиков:', error));
  }

  // Функция для создания карточки котика
  function createCatCard(cat) {
    const div = document.createElement('div');
    div.classList.add('cat-card');

    const img = document.createElement('img');
    img.src = cat.image;
    img.alt = cat.name;

    const id = document.createElement('p');
    id.textContent = `ID: ${cat.id}`;

    const name = document.createElement('h3');
    name.textContent = cat.name;

    const age = document.createElement('p');
    age.textContent = `Возраст: ${cat.age} года`;

    const rate = document.createElement('p');
    rate.textContent = `Оценка: ${cat.rate}`;

    const favorite = document.createElement('p');
    favorite.textContent = `Избранный: ${cat.favorite ? 'Да' : 'Нет'}`;

    const description = document.createElement('p');
    description.textContent = cat.description;

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Изменить';
    updateButton.addEventListener('click', function() {
      openEditModal(cat); // Открываем модальное окно для изменения котика
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', function() {
      deleteCat(cat.id); // Вызываем функцию удаления котика по его ID
    });

    div.appendChild(img);
    div.appendChild(id);
    div.appendChild(name);
    div.appendChild(age);
    div.appendChild(rate);
    div.appendChild(favorite);
    div.appendChild(description);
    div.appendChild(updateButton);
    div.appendChild(deleteButton);

    return div;
  }

  // Функция для открытия модального окна с данными котика для изменения
  function openEditModal(cat) {
    const editCatName = document.getElementById('editCatName');
    const editCatImage = document.getElementById('editCatImage');
    const editCatAge = document.getElementById('editCatAge');
    const editCatRate = document.getElementById('editCatRate');
    const editCatFavorite = document.getElementById('editCatFavorite');
    const editCatDescription = document.getElementById('editCatDescription');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const closeEditBtn = document.getElementById('closeEditBtn');

    editCatName.value = cat.name;
    editCatImage.value = cat.image;
    editCatAge.value = cat.age;
    editCatRate.value = cat.rate;
    editCatFavorite.checked = cat.favorite;
    editCatDescription.value = cat.description;

    editModal.style.display = 'block';

    // Обработчик нажатия кнопки "Сохранить"
    saveEditBtn.addEventListener('click', function() {
      const editedCatData = {
        name: editCatName.value,
        image: editCatImage.value,
        age: parseInt(editCatAge.value),
        rate: parseInt(editCatRate.value),
        favorite: editCatFavorite.checked,
        description: editCatDescription.value
      };

      fetch(`https://cats.petiteweb.dev/api/single/db/update/${cat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedCatData)
      })
      .then(response => {
        console.log('Котик изменен успешно!');
        loadCats(); // После изменения обновляем список котиков
        editModal.style.display = 'none'; // Закрываем модальное окно
      })
      .catch(error => console.error('Ошибка при изменении кота:', error));
    });

    // Обработчик нажатия кнопки "Закрыть"
    closeEditBtn.addEventListener('click', function() {
      editModal.style.display = 'none'; // Закрываем модальное окно
    });
  }

  // Функция для отправки запроса на удаление кота по его ID
  function deleteCat(catId) {
    fetch(`https://cats.petiteweb.dev/api/single/db/delete/${catId}`, {
      method: 'DELETE'
    })
    .then(response => {
      console.log('Котик удален успешно!');
      loadCats(); // После удаления обновляем список котиков
    })
    .catch(error => console.error('Ошибка при удалении кота:', error));
  }

  // Обработчик отправки формы добавления котика
  addCatForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const catId = document.getElementById('catId').value; // Получаем введенный ID
    const catData = {
      id: catId, // Используем введенный ID
      name: document.getElementById('catName').value,
      image: document.getElementById('catImage').value,
      age: parseInt(document.getElementById('catAge').value),
      rate: parseInt(document.getElementById('catRate').value),
      favorite: document.getElementById('catFavorite').checked,
      description: document.getElementById('catDescription').value
    };

    fetch(`https://cats.petiteweb.dev/api/single/db/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(catData)
    })
    .then(response => {
      console.log('Котик добавлен успешно!');
      loadCats(); // После добавления обновляем список котиков
      addCatForm.reset(); // Очищаем форму
    })
    .catch(error => console.error('Ошибка при добавлении котика:', error));
  });

  // Загрузить котиков при загрузке страницы
  loadCats();
});
