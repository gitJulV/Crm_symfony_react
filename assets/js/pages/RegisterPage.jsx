import React, { useState } from 'react';
import Field from '../components/Form/Field';
import { Link } from 'react-router-dom';
import registerAPI from '../services/registerAPI';

const RegisterPage = ({ history }) => {

    const [user, setUser] = useState({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const apiErrors = {};

        if (user.password !== user.confirmPassword) {
            apiErrors.confirmPassword = "Les mot de passe sont différents";
            setErrors(apiErrors);
            return;
        }

        try {
            await registerAPI.register(user);
            setErrors({});
            history.replace('/Login');

        } catch (error) {
            console.log(error.response)
            const { violations } = error.response.data;

            if (violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }
    }

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom"
                    placeholder="Entrer votre nom..."
                    handleChange={handleChange}
                    value={user.lastName}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Entrer votre prénom..."
                    handleChange={handleChange}
                    value={user.firstName}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Entrer votre adresse email..."
                    type="email"
                    handleChange={handleChange}
                    value={user.email}
                    error={errors.email}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    placeholder="Entrer votre mot de passe..."
                    type="password"
                    handleChange={handleChange}
                    value={user.password}
                    error={errors.password}
                />
                <Field
                    name="confirmPassword"
                    label="Confirmation mot de passe"
                    placeholder="Confirmer votre mot de passe..."
                    type="password"
                    handleChange={handleChange}
                    value={user.confirmPassword}
                    error={errors.confirmPassword}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">inscription</button>
                    <Link to="/Login" className="btn btn-link"> j'ai déja un compte</Link>
                </div>
            </form>
        </>
    );
}

export default RegisterPage;