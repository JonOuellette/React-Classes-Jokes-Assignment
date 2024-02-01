import React, { Component } from 'react';
import './Joke.css';

class Joke extends Component {
    render() {
        return (
            <div className="Joke">
                <div className="Joke-votearea">
                  <button onClick={() => this.props.vote(this.props.id, 1)}>
                    <i className="fas fa-thumbs-up" />
                  </button>

                  <button onClick={() => this.props.vote(this.props.id, -1)}>
                    <i className="fas fa-thumbs-down" />
                  </button>


                    {this.props.votes}
                </div>

                <div className="Joke-text">{this.props.text}</div>
            </div>
        );
    }
}

export default Joke;
