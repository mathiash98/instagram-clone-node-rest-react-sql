import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Auth from '../../utils/AuthHelper';

import './postThumb.css';

const auth = new Auth();

export default class PostThumb extends Component {
    constructor(props) {
        super(props);
        this.state = props.data;
        this.state.imgSrc = "";
        this.state.isLoaded = false;
        this.state.error = null;
    }
    componentDidMount() {
        auth.fetch("/api/img/"+this.state.img_id, {
            method: "GET",
        })
        .then(
        (blob) => {
            this.setState({
                error: null,
                isLoaded: true,
                imgSrc: URL.createObjectURL(blob)
            });
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            });
            console.log(error);
        });
    }
    render() {
        const post = this.state;
        if (post.isLoaded) {
            return (
                <Link to={"/post/"+post.id} className="postThumb">
                    <img src={this.state.imgSrc} alt={post.description}/>
                    <div className="postThumb-info">
                        <FontAwesomeIcon icon={['fas', 'heart']} className="white"></FontAwesomeIcon>
                        <span>{post.likes}</span>
                    </div>
                </Link>
            )
        } else {
            return (
                <div className="postThumb">
                    loading
                </div>
            )
        }
    }
}
