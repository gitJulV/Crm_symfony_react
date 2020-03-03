
import React from 'react';
import ReactDom from 'react-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import CustomersPage from './pages/CustomersPage';
import { HashRouter, Switch, Route } from 'react-router-dom';
// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <div className="container pt-5">
                <Switch>
                    <Route path="/Invoices" component={InvoicesPage} />
                    <Route path="/Customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </div>
        </HashRouter>
    );
}

const rootElement = document.getElementById('app');
ReactDom.render(<App />, rootElement);