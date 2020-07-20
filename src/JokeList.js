import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";
import { render } from "@testing-library/react";

class JokeList extends Component {
  constructor(props) {
    this.super(props);
    this.state = {jokes: []};
  }

  static defaultProps = {
    numJokesToGet: 10
  };

  componentDidMount() {
    if (this.state.jokes.length === 0) getJokes();
  }
  /* get jokes if there are no jokes */

  async getJokes() {
    let seenJokes = new Set(this.state.jokes.map(j => j.id));
    try {
      while (this.state.jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          this.state.jokes.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState(
        { jokes }
      );
    } catch (e) {
      console.log(e);
    }
  }

  /* empty joke list and then call getJokes */

  generateNewJokes() {
    setJokes([]);
  }

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* render: either loading spinner or list of sorted jokes. */

  if (jokes.length) {
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    render(){
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={generateNewJokes}>
            Get New Jokes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
          ))}
        </div>
      );
    }
  }

  return null;

}

export default JokeList;
