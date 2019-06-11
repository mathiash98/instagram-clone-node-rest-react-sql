import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

export default class header extends Component {
    render() {
        return (
            <header id="header">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Feed</Link>
                            <Link to="/profile">Profile</Link>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }
}
