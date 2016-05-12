import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import MovieStore from 'movie_store';
import FavoriteStore from 'favorite_store';
import BaseMovieItem from 'base_movie_item';
import '../scss/movie_list.scss'
import '../scss/bootstrap.scss'

export default class MovieList extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      movies: MovieStore.getAll(),
      favorites: FavoriteStore.getAll()
    }

    this.movieHandler = () => {
      this.setState({
        movies: MovieStore.getAll()
      });
    }
    this.favoriteHandler = () => {
      console.log('2222');
      this.setState({
        favorites: FavoriteStore.getAll()
      });
    }
  };

  componentDidMount() {
    MovieStore.on('change', this.movieHandler);
    FavoriteStore.on('change', this.favoriteHandler);
    window.ml = this;
  };

  componentWillUnmount() {
    MovieStore.off('change', this.movieHandler);
    FavoriteStore.off('change', this.favoriteHandler);
  };

  onChange(evt) {
    this.setState({
      filter: evt.target.value
    })
  };

  render() {
    console.log('rendering');
    var dom = this.state.movies.map(function(movie) {
      return <BaseMovieItem
              name={movie.name}
              id={movie.id}
              img={movie.img}
              favorite={this.state.favorites.indexOf(movie.id) >= 0}
             />
    }, this);
    return <div className="movie-list container">
            <div className="row row-centered">
              {dom}
            </div>
           </div>
  }
}