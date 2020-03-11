
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import InvoicesPage from './pages/InvoicesPage';
import CustomersPage from './pages/CustomersPage';
import { HashRouter, Switch, Route, withRouter } from 'react-router-dom';
import authAPI from './services/authAPI';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

authAPI.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(
        authAPI.isAuthentificated()
    );

    const NavbarWithRouter = withRouter(Navbar);

    const contextValue = {
        isAuthenticated,
        setIsAuthenticated
    }

    return (
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter />
                <div className="container pt-5">
                    <Switch>
                        <Route path="/Login" component={LoginPage} />
                        <PrivateRoute path="/Invoices" component={InvoicesPage} />
                        <PrivateRoute path="/Customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </div>
            </HashRouter>
        </AuthContext.Provider>
    );
}

const rootElement = document.getElementById('app');
ReactDom.render(<App />, rootElement);