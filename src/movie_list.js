import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import MovieStore from 'movie_store';

export default class MovieList extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      movies: []
    }
  };

  componentDidMount() {
    this.movieStore = new MovieStore();
    this.movieStore.on('change', () => {
      console.log('changed');
      this.setState({
        movies: this.movieStore.getAll()
      });
    });
    this.movieStore.start();
    window.app = this;
  };

  render() {
    var dom = this.state.movies.map(function(movie) {
      return <div>
              <img src={movie.img} />
              <div class="name">{movie.name}</div>
             </div>
    });
    return <div>{dom}</div>
  }
}