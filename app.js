const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const targetUrl = 'https://mobilbah.onrender.com';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/redirect', async (req, res) => {
  const redirectCondition = false; // Измени это условие в зависимости от логики

  if (redirectCondition) {
    try {
      // Делаем запрос к внешнему сайту
      const response = await axios.get(targetUrl);

      // Если статус ответа не 404, перенаправляем пользователя
      if (response.status !== 404) {
        return res.redirect(targetUrl);
      }
    } catch (error) {
      console.error('Произошла ошибка:', error.message);

      // Обработка ошибки 404
      if (error.response && error.response.status === 404) {
        return res.redirect('public/index.html');
      } else {
        // Обработка других ошибок
        return res.status(500).send('Произошла ошибка на сервере');
      }
    }
  } else {
    // Перенаправляем на локальный сайт
    res.redirect('/index.html');
  }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
