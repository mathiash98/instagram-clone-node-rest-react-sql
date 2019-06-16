import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

import Auth from '../../utils/AuthHelper';

import loading from '../../images/loading_pacman.gif';
import './login.css';

const auth = new Auth();

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loading: false,
            error: null,
            toDashboard: false
        };
    }
    render() {
        if (this.state.loading) {
            return (<div><img src={loading} alt="loading"></img></div>)
        } else if (this.state.toDashboard) {
            return <Redirect to='/'></Redirect>
        } else {
            return (
                <form onSubmit={this.handleSubmit} className="loginForm">
                    <h1 className="center">Login</h1>
                    <input type="text"
                        name="username"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.handleChange} />
                    <input type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange} />
                    <input type="submit" className="btn btn-success" value="Login"/>
                </form>
            )
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({loading: true});

        auth.login(this.state.username, this.state.password)
        .then(token => {
            console.log(token);
            this.setState({
                loading: false,
                error: false,
                toDashboard: true
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                loading: false,
                error: err
            });
        });
    }
    
    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [name]: value
        });
    }
}
