import React, { useState, useContext } from 'react';
import authAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/Form/Field';

const LoginPage = ({ history }) => {
    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    //Gestion des champs
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setCredentials({ ...credentials, [name]: value })
    }

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await authAPI.authentificate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/Customers");
        } catch (error) {
            console.log(error.reponse);
            setError("Erreur d'authentification");
        }
        console.log(credentials);
    }


    return (
        <>
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="username"
                    label="Adresse de connexion"
                    handleChange={handleChange}
                    value={credentials.username}
                    type="email"
                    placeholder="Entrer email..."
                    error={error}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    handleChange={handleChange}
                    value={credentials.password}
                    type="password"
                    placeholder="Entrer mot de passe..."
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">connexion</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;