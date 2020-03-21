import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/Form/Field';
import customersAPI from '../services/customersAPI';

const CustomerPage = (props) => {

    const { id = "new" } = props.match.params;

    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    })
    const [editing, setEditing] = useState(false);

    const fetchCustomer = async id => {
        try {
            const { firstName, lastName, email, company } = await customersAPI.find(id);
            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value });
    }

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                await customersAPI.update(id, customer);
            } else {
                await customersAPI.create(customer);
                props.history.replace("/Customers");
            }
        } catch (error) {
            console.log(error.response.data.violations)
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }
    }

    return (
        <>
            {!editing && <h1>Nouveau client</h1> || <h1>Modifier client</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom du client"
                    handleChange={handleChange}
                    value={customer.lastName}
                    placeholder="Nom du client..."
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom du client"
                    handleChange={handleChange}
                    value={customer.firstName}
                    placeholder="Prénom du client..."
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email du client"
                    handleChange={handleChange}
                    value={customer.email}
                    type="email"
                    placeholder="Email du client..."
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise du client"
                    handleChange={handleChange}
                    value={customer.company}
                    placeholder="Entreprise du client..."
                    error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">{!editing && "Créer client" || "modifier client"}</button>
                    <Link className="btn btn-link" to="/Customers">Retour aux clients</Link>
                </div>
            </form>
        </>
    );
}

export default CustomerPage;