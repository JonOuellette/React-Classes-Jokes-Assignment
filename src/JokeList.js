import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10
    };

    constructor(props) {
        super(props);
        this.state = { jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"), loading: false };
        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if (this.state.jokes.length === 0) this.getJokes();
    }

    async getJokes() {
        try {
            let jokes = [];
            while (jokes.length < this.props.numJokesToGet) {
                let response = await axios.get("https://icanhazdadjoke.com/", {
                    headers: { Accept: "application/json" }
                });
                let newJoke = response.data.joke;
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({ id: uuidv4(), text: newJoke, votes: 0 });
                } else {
                    console.log("Found a duplicate joke:", newJoke);
                }
            }
            this.setState(st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes]
            }),
                () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
            );
        } catch (e) {
            alert(e);
            this.setState({ loading: false });
        }
    }

    handleVote(id, delta) {
        this.setState(
            st => ({
                jokes: st.jokes.map(j =>
                    j.id === id ? { ...j, votes: j.votes + delta } : j
                )
            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }

    handleClick() {
        this.setState({ loading: true }, this.getJokes);
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin" />
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            );
        }

        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img
                        src="https://icanhazdadjoke.com/j/R7UfaahVfFd.png"
                        alt="Laughing emoji"
                    />
                    <button className="JokeList-getmore" onClick={this.handleClick}>
                        Fetch Jokes
                    </button>
                </div>

                <div className="JokeList-jokes">
                    {jokes.map(j => (
                        <Joke 
                        key={j.id} 
                        id={j.id}
                        votes={j.votes} 
                        text={j.text} 
                        vote={(id, delta) => this.handleVote(id, delta)} 
                    />
                    
                    ))}
                </div>
            </div>
        );
    }
}

export default JokeList;
