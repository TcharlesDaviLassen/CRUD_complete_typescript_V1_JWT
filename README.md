### Desenvolver um exemplo completo de um backend REST API avançado com todos os critérios de segurança em TypeScript é um processo complexo e extenso. No entanto, vou fornecer um exemplo simplificado que aborda algumas das principais práticas de segurança. Lembre-se de que este é apenas um exemplo básico e que você precisa adaptá-lo às necessidades específicas do seu projeto.

Vou usar o framework Express.js e algumas bibliotecas populares para demonstrar a implementação. Certifique-se de ter o Node.js e o npm (ou yarn) instalados antes de começar.

### Configuração inicial:

- Crie um novo diretório para o seu projeto e execute npm init (ou yarn init) para iniciar um novo projeto Node.js.
- Instale as dependências necessárias executando npm install express body-parser cors jsonwebtoken bcrypt (ou yarn add express body-parser cors jsonwebtoken bcrypt).

### Estrutura do projeto:

- Crie um diretório chamado src e dentro dele crie os diretórios controllers, middlewares, models e routes.
- Crie um arquivo server.ts na raiz do projeto para iniciar o servidor.

### Configuração do servidor:

```typescript

// server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Importe e use as rotas da API aqui

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
```

### Implementação das rotas:

### Crie um arquivo `routes/userRoutes.ts` para definir as rotas relacionadas aos usuários:

```typescript

// userRoutes.ts
import express from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rota de registro de usuário
router.post('/register', UserController.register);

// Rota de login de usuário
router.post('/login', UserController.login);

// Rota protegida que requer autenticação
router.get('/profile', authMiddleware, UserController.profile);

export default router;
```

### Implementação dos controladores:

### Crie um arquivo `controllers/UserController.ts` para lidar com as ações relacionadas aos usuários:

```typescript
// UserController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const UserController = {

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Verifique se o usuário já está registrado
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Usuário já registrado' });
      }

      // Crie uma nova senha criptografada
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crie um novo usuário
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      // Gere um token de acesso
      const token = jwt.sign({ userId: newUser._id }, 'chave-secreta-do-token');

      res.json({ token });
    } catch (error) {
      console.error('Erro durante o registro:', error);
      res.status(500).json({ message: 'Erro durante o registro' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Verifique se o usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Verifique se a senha está correta
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha inválida' });
      }

      // Gere um token de acesso
      const token = jwt.sign({ userId: user._id }, 'chave-secreta-do-token');

      res.json({ token });
    } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(500).json({ message: 'Erro durante o login' });
    }
  },

  async profile(req: Request, res: Response) {
    try {
      // Acesso permitido apenas para usuários autenticados
      const userId = req.userId; // obtém o ID do usuário autenticado a partir do middleware
      const user = await User.findById(userId);

      res.json({ user });
    } catch (error) {
      console.error('Erro ao acessar o perfil:', error);
      res.status(500).json({ message: 'Erro ao acessar o perfil' });
    }
  },
};

export default UserController;
```


### Implementação do middleware de autenticação:

### Crie um arquivo `middlewares/authMiddleware.ts` para verificar a autenticação do usuário antes de acessar rotas protegidas:

```typescript
// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verifique se o token de acesso está presente no cabeçalho da solicitação
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso não fornecido' });
    }

    // Verifique a validade do token
    const decoded = jwt.verify(token, 'chave-secreta-do-token');
    req.userId = decoded.userId; // armazene o ID do usuário autenticado no objeto de solicitação

    next();
  } catch (error) {
    console.error('Erro durante a autenticação:', error);
    res.status(401).json({ message: 'Falha na autenticação' });
  }
};

export default authMiddleware;
```

### Implementação do modelo do usuário:

### Crie um arquivo `models/User.ts` para definir o modelo do usuário:

```typescript
// User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<UserDocument>('User', userSchema);
```

### Configuração do banco de dados:
Configure a conexão com o banco de dados no arquivo server.ts usando uma biblioteca como o Mongoose.
Essa é apenas uma implementação básica para ilustrar os conceitos. Lembre-se de ajustar o código de acordo com as necessidades específicas do seu projeto, como adicionar validações adicionais, armazenar senhas de forma segura, lidar com erros, etc. Além disso, não se esqueça de configurar a autenticação e autorização adequadas, como o uso de tokens JWT, proteção de rotas sensíveis e uso de HTTPS.