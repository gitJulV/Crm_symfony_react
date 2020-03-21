import React, { useState, useEffect } from 'react';
import Field from '../components/Form/Field';
import Select from '../components/Form/Select';
import { Link } from 'react-router-dom';
import customersAPI from '../services/customersAPI';
import axios from 'axios';
import invoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({ history, match }) => {

    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });
    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    useEffect(() => {
        fetchCustomers()
    }, []);

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id])

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                await invoicesAPI.update(id, invoice)
                //notif success
            } else {
                await invoicesAPI.create(invoice)
                history.replace('/Invoices');
                //notif success
            }
        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }

    }

    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);

            if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id })
        } catch (error) {
            console.log(error.response)
        }
    }

    const fetchInvoice = async (id) => {
        try {
            const { amount, status, customer } = await invoicesAPI.find(id);
            setInvoice({ amount, status, customer: customer.id });
        } catch (error) {
            console.log(error.response);
        }
    }

    return (
        <>
            {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    label="Montant"
                    placeholder="Montant de la facture..."
                    value={invoice.amount}
                    handleChange={handleChange}
                    type="number"
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Client"
                    handleChange={handleChange}
                    value={invoice.customer}
                    error={errors.customer}
                >
                    {customers.map(customer => <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}</option>)}
                </Select>

                <Select
                    name="status"
                    label="Statut"
                    handleChange={handleChange}
                    value={invoice.status}
                    error={errors.status}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/Invoices" className="btn btn-link">Retour aux factures</Link>
                </div>

            </form>
        </>
    );
}

export default InvoicePage;