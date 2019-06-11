import React, { Component } from 'react'

import PostIcon from '../../components/postIcon/PostIcon';

import './profile.css';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            isLoaded: false,
            error: false,
            data: {}
        };
    }
    componentDidMount() {
        fetch('http://localhost:8888/api/user/'+this.props.match.params.id, {
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
                res.text()
                .then(err => {
                    this.setState({
                        error: err,
                        isLoaded: true
                    });
                })
            }
        }).then(data => {
            this.setState({
                isLoaded: true,
                user: data
            });
        });
    }
    render() {
        const { error, isLoaded, user } = this.state;
        if (error) {
            return <div>Error</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="profile">
                    <div className="profile-info">
                        <img alt="profile-pic"></img>
                        <div className="profile-info-follow">
                            <div className="profile-stat">
                                <div className="user-stat">
                                    <span className="number">{user.posts_num}</span>
                                    <span className="label">Posts</span>
                                </div>
                                <div className="user-stat">
                                    <span className="number">{user.followers_num}</span>
                                    <span className="label">Followers</span>
                                </div>
                                <div className="user-stat">
                                    <span className="number">{user.follow_num}</span>
                                    <span className="label">Follows</span>
                                </div>
                            </div>
                            <div className="follow">
                                <button className="btn">Follow/unfollow</button>
                            </div>
                        </div>
                    </div>
                    <span className="bold">{user.username}</span>
                </div>
            )
        }
    }
}
