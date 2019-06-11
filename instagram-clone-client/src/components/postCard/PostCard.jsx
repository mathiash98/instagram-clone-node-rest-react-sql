import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './postCard.css';

export default class PostCard extends Component {
    constructor(props) {
        super(props);
        this.state = props.data;
        this.state.isLoaded = false;
        this.state.error = null;
        if (props.data.imgSrc) {
            this.state.imgSrc = props.data.imgSrc;
        } else {
            this.state.imgSrc = "";
        }
    }
    componentDidMount() {
        if (this.state.img_id) {
            let headers = new Headers();
            headers.append('Authorization', "Bearer " + localStorage.getItem('jwt'));
            fetch("http://localhost:8888/api/img/"+this.state.img_id, {
                method: "GET",
                mode: "cors",
                credentials: "include",
                redirect: "follow",
                headers: headers
            })
            .then(res => res.blob())
            .then(
            (blob) => {
                console.log(blob);
                this.setState({
                    error: null,
                    isLoaded: true,
                    imgSrc: URL.createObjectURL(blob)
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: true
                });
                console.log(error);
            });
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({...newProps.data});
    }
    render() {
        const data = this.state;
        return (
            <div className="postCard">
                <div className="postCard-header">
                    <Link to={"/user/"+data.user_id} className="user">
                        <img className="userProfilePic" src="https://via.placeholder.com/140x140" alt="profilePic"/>
                        <span className="userProfileName"> {data.username}</span>
                    </Link>
                </div>
                    <img src={data.imgSrc !== "" ? data.imgSrc : this.state.imgSrc} alt=""/>
                <div className="info">
                    <div className="post-buttons">
                        <FontAwesomeIcon icon={data.liked ? ['fas', 'heart'] : ['far', 'heart']} className={data.liked ? "red" : ""} onClick={this.like}></FontAwesomeIcon>
                        <FontAwesomeIcon icon={["far", "comment"]}></FontAwesomeIcon>
                    </div>
                    <span>{data.likes} likes</span>
                    <p><span className="bold">{data.username}</span>  {data.description}</p>
                </div>
            </div>
        )
    }

    like = (e) => {
        let headers = new Headers();
        let likeOrUnlike = "like";
        if (this.state.liked) {
            likeOrUnlike = "unlike";
        }
        headers.append('Authorization', "Bearer " + localStorage.getItem('jwt'));
        fetch("http://localhost:8888/api/post/"+this.state.id+"/"+likeOrUnlike, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            redirect: "follow",
            headers: headers
        })
        .then(res => {
            console.log(res);
            if (res.ok) {
                if (this.state.liked) {
                    this.setState({
                        liked: 0,
                        likes: this.state.likes - 1 
                    });
                } else {
                    this.setState({
                        liked: 1,
                        likes: this.state.likes + 1
                    });
                }
                return res.text();
            } else {
                res.text()
                .then(error => {
                    console.log(error);
                    // this.setState({
                    //     error: error,
                    //     isLoaded: false
                    // })
                })
            }
        })
        .then(
        (text) => {
            console.log(text);
        },
        (error) => {
            this.setState({
                error: true
            });
            console.log(error);
        });
    }
}
