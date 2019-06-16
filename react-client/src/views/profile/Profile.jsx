import React, { Component } from 'react'

import PostThumb from '../../components/postThumb/PostThumb';
import Auth from '../../utils/AuthHelper';

import './profile.css';

const auth = new Auth();

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: false,
            user: {}
        };
    }
    componentDidMount() {
        auth.fetch('/api/user/'+this.props.match.params.id, {
            method: "GET",
        })
        .then(body => {
            console.log(body);
            this.setState({
                isLoaded: true,
                error: false,
                user: body
            });
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoaded: true,
                error: err
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
                        <img alt="profile-pic" className="profile-pic" src="https://via.placeholder.com/140x140"></img>
                        <div className="profile-info-follow">
                            <div className="profile-stat">
                                <div className="user-stat">
                                    <span className="label"><b>{user.posts_num}</b> Posts</span>
                                </div>
                                <div className="user-stat">
                                    <span className="label"><b>{user.followers_num}</b> Followers</span>
                                </div>
                                <div className="user-stat">
                                    <span className="label">Follows <b>{user.following_num}</b></span>
                                </div>
                            </div>
                            <div className="follow">
                                <button className="btn" onClick={this.follow}>Follow/unfollow</button>
                            </div>
                            <div className="description">
                                <p><b>{user.username}</b></p>
                            </div>
                        </div>
                        
                    </div>

                    <div className="post-grid">
                        {user.posts.map((post) => <PostThumb data={post} key={post.id}></PostThumb>)}
                    </div>
                </div>
            )
        }
    }

    follow() {
        //TODO: Follow / unfollow user
        
    }
}
