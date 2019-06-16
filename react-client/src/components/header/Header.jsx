import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './header.css';

import { UserConsumer } from '../../context/UserContext';
import Auth from '../../utils/AuthHelper';

const auth = new Auth();

export default class Header extends Component {
    render() {
        return (
            <UserConsumer>
                {user => (
                    <header id="header">
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Feed</Link>
                            </li>
                            {user.isLoggedIn ? <>
                                    <li><Link to={"/user/"+user.id}>Profile</Link></li>
                                    <li><button onClick={auth.logout}>Logout</button></li>
                                    </> : <li><Link to="/login">Login</Link></li>}
                            <li>
                                <Link to="/upload">Upload</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                )}
            </UserConsumer>
        )
    }
}
