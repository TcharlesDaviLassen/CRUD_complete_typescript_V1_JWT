// UserController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import { User } from '../models/User';

const UserController = {

    async register(req: Request, res: Response) {

        // const { name, email, password } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);
        // await User.sync({ force: true });

        // const dados = (
        //     {
        //         "name": "TCHARLES",
        //         // "age": 26,
        //         // "sex": "M",
        //         "email": "tdl@tdl.com",
        //         "password": `${hashedPassword}`,
        //         "createdAt": new Date(),
        //         "updatedAt": new Date(),
        //     }
        // );

        // await User.create(dados);

        // const users = await User.findAll();
        // console.log(users);

        try {
            const { name, email, password } = req.body;

            // Verifique se o usuário já está registrado
            const existingUser = await User.findOne({  where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Usuário já registrado' });
            }

            // Crie uma nova senha criptografada
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crie um novo usuário
            const newUser: any = new User({ name, email, password: hashedPassword });
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
            const user: any = await User.findOne({ where: { email } });
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
            // const userId = req.userId; // obtém o ID do usuário autenticado a partir do middleware
            const user = await User.findAll();

            res.json({ user });
        } catch (error) {
            console.error('Erro ao acessar o perfil:', error);
            res.status(500).json({ message: 'Erro ao acessar o perfil' });
        }
    },
};

export { UserController };
