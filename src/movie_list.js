import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import MovieStore from 'movie_store';
import FavoriteStore from 'favorite_store';
import '../scss/movie_list.scss'
import '../scss/bootstrap.scss'

export default class MovieList extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      movies: MovieStore.getAll(),
      favorites: FavoriteStore.getAll(),
      filter: ''
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

  onFavoriteClick(evt) {
    console.log(evt.target.dataset.id);
    FavoriteStore.toggle(evt.target.dataset.id);
  }

  render() {
    console.log('rendering');
    var dom = this.state.movies.map(function(movie) {
      if (!this.state.filter ||
          movie.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0) {
        var icon;
        if (this.state.favorites.indexOf(movie.id) >= 0) {
          icon = <span
                  className="glyphicon glyphicon-heart"
                  aria-hidden="true"
                  data-id={movie.id}
                  onClick={(evt) => {this.onFavoriteClick(evt)}}>
                 </span>
        } else {
          icon = <span className="glyphicon glyphicon-heart-empty"
                  aria-hidden="true"
                  data-id={movie.id}
                  onClick={(evt) => {this.onFavoriteClick(evt)}}>
                 </span>;
        }
        return <div className="movie-item">
                <img src={movie.img} />
                <div>
                  <div className="name">
                    {icon}
                    <a href={"#movie/" + movie.id}>
                      {movie.name}
                    </a>
                  </div>
                </div>
               </div>
      }
    }, this);
    return <div className="movie-list">
            {dom}
           </div>
  }
}