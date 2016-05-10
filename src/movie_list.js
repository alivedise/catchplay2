import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import MovieStore from 'movie_store';
import '../scss/movie_list.scss'

export default class MovieList extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      filter: ''
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

  onChange(evt) {
    this.setState({
      filter: evt.target.value
    })
  };

  render() {
    var dom = this.state.movies.map(function(movie) {
      if (!this.state.filter ||
          movie.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0) {
        return <div className="movie-item">
                <img src={movie.img} />
                <div className="name">{movie.name}</div>
               </div>
      }
    }, this);
    return <div className="movie-list">
            <div className="search-bar">
              <input type="text" onChange={(evt) => this.onChange(evt)} />
            </div>
            {dom}
           </div>
  }
}