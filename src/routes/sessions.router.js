import { Router } from 'express';
import usersModel from '../dao/models/users.model.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/authFailureRegister', failureFlash: true }), async (req, res) => {
    req.session.user = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        birthDate: req.user.birthDate,
        userRole: 'user'
    };
    res.send({ status: 1, msg: "Nuevo cliente conectado" });
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/authFailureLogin', failureFlash: true }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 0, msg: 'Error al conectar' });
    req.session.user = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        birthDate: req.user.birthDate,
        userRole: req.user.userRole
    };
    res.send({ status: 1, msg: 'Inicio de sesion exitoso', user: req.session.user });
});

router.post('/resetpassword', passport.authenticate('resetPassword', { failureRedirect: '/api/sessions/authFailureReset', failureFlash: true }), async (req, res) => {
    res.send({ status: 1, msg: 'Contraseña restablecida con éxito. Será redirigido a la página de inicio de sesión' });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send({ status: 1, msg: 'Cliente desconectado con éxito' });
});

router.get('/authFailureRegister', (req, res) => {
    const error = req.flash('error')[0];
    res.status(400).send({ status: 0, msg: error });
});

router.get('/authFailureLogin', (req, res) => {
    const error = req.flash('error')[0];
    res.status(400).send({ status: 0, msg: error });
});

router.get('/authFailureReset', (req, res) => {
    const error = req.flash('error')[0];
    res.status(400).send({ status: 0, msg: error });
});

export default router;