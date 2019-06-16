import React, { Component } from 'react'

import PostCard from '../postCard/PostCard';

import './feed.css';

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }
    componentDidMount() {
        fetch("http://localhost:8888/api/post", {
            method: "GET",
            mode: "cors",
            credentials: "include",
            redirect: "follow",
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('jwt')
            }
        })
        .then(res => {
            console.log(res);
            if (res.ok) {
                return res.json();
            } else {
                throw Error(res.responseText);
            }
        })
        .then((items) => {
            console.log(items);
            this.setState({
                error: null,
                isLoaded: true,
                items: items
            });
        })
        .catch((error) => {
            this.setState({
                isLoaded: true,
                error: error
            });
            console.log(error);
        });
        
    }
    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="feed">
                    {items.map(item => (
                        <PostCard data={item} key={item.id}></PostCard>
                    ))}
                </div>
            )
        }
    }

}
