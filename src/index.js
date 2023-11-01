// Importe as dependências
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3333;

// Use middlewares
app.use(cors());
app.use(bodyParser.json());

// Lista de usuários (simulando um banco de dados)
const users = [];
const messages = [];

// Rota para cadastrar um usuário
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Verifique se o email já está registrado
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'E-mail já cadastrado.' });
  }

  // Faça o hash da senha antes de armazená-la
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json({ message: 'Conta criada com sucesso.', user: newUser });
});

// Rota para fazer o login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Encontre o usuário pelo email
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  // Compare a senha fornecida com a senha armazenada após descriptografia
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: 'Credenciais inválidas.' });
  }

  res.status(200).json({ message: 'Login bem-sucedido!', userId: user.id });
});

// Rota para adicionar um recado
app.post('/messages', (req, res) => {
  const { text, userId } = req.body;

  const message = {
    id: uuidv4(),
    text,
    userId,
  };

  messages.push(message);

  res.status(201).json({ message: 'Recado criado com sucesso.', message });
});

// Rota para listar todos os recados
app.get('/messages', (req, res) => {
  res.status(200).json(messages);
});


app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
