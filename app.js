const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const targetUrl = 'https://mobilbah.onrender.com';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.redirect('/index.html');
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
