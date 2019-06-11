import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './header.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: localStorage.getItem('jwt'),
            user: this.parseJwt(localStorage.getItem('jwt'))
        };
    }
    
    parseJwt (token) {
        if (token === null) {
            return null;
        } else {
            var base64Url = token.split('.')[1];
            var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(base64).data;
        }
    }
    
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        return (
            <header id="header">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Feed</Link>
                        </li>
                        {isLoggedIn ? <>
                                <li><Link to={"/user/"+this.state.user.id}>Profile</Link></li>
                                <li><span onClick={this.logout}>Logout</span></li>
                                </> : <li><Link to="/login">Login</Link></li>}
                        <li>
                            <Link to="/upload">Upload</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }

    logout = (e) => {
        localStorage.removeItem('jwt');
        this.setState({
            isLoggedIn: localStorage.getItem('jwt'),
            user: this.parseJwt(localStorage.getItem('jwt'))
        });
    }
}
