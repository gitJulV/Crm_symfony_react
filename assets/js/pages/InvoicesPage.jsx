import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';
import moment from 'moment';
import { Link } from 'react-router-dom';

const STATUS_CLASSES = {
    PAID: "success",
    SEND: "primary",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SEND: "En cours",
    SENT: "En cours",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    //Permet d'aller récupérer les invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll()
            setInvoices(data);
        } catch (error) {
            console.log(error.response)
        }
    }

    //Au chargement du composant, on va chercher les invoices 
    useEffect(() => { fetchInvoices() }, []);

    //Gestion de la suppresion d'une invoice
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id)
        } catch (error) {
            setInvoices(originalInvoices);
        }
    }

    //Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    //Gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    //Filtrage des invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    //Pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link className="btn btn-primary" to="/invoices/new">Nouvelle facture</Link>
            </div>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    onChange={handleSearch}
                    value={search}
                    placeholder="Rechercher..."
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Montant</th>
                        <th />
                    </tr>
                </thead>

                <tbody>
                    {paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()}€</td>
                            <td>
                                <Link to={"Invoices/" + invoice.id} className="btn btn-sm btn-warning mr-1">Modifier</Link>
                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    className="btn btn-sm btn-danger">Supprimer
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {itemsPerPage < filteredInvoices.length && (
                < Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredInvoices.length}
                    onPageChanged={handlePageChange}
                />
            )}
        </>
    );
}

export default InvoicesPage;