import React, { Component } from 'react'

import { Redirect } from 'react-router-dom';

import loading from '../../images/loading_pacman.gif';
import './login.css';

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
        const data = {
            username: this.state.username,
            password: this.state.password
        };
        fetch('http://localhost:8888/auth/local-login', {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            console.log(res);
            if (res.ok) {
                res.text()
                .then( token => {
                    console.log(token);
                    // Do something with token
                    localStorage.setItem('jwt', token);
                    this.setState({
                        loading: false,
                        token: token,
                        toDashboard: true
                    });

                });
            } else {
                res.text()
                .then(text => {
                    console.log(text);
                    this.setState({
                        error: text,
                        loading: false
                    });
                })
            }
        })
        
    }
    
    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [name]: value
        });
    }
}
