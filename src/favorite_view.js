import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import FavoriteStore from 'favorite_store';
import MovieStore from 'movie_store';
import Service from 'service';

export default class FavoriteView extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      list: FavoriteStore.getAll(),
      movies: MovieStore.getAll()
    }
    this.movieHandler = () => {
      this.setState({
        movies: MovieStore.getAll()
      });
    }
    this.favoriteHandler = () => {
      console.log('1111');
      this.setState({
        list: FavoriteStore.getAll()
      });
    }
  };

  componentDidMount() {
    this.fs = FavoriteStore;
    FavoriteStore.on('change', this.favoriteHandler);
    MovieStore.on('change', this.movieHandler);
    window.f = this;
    this.fs = FavoriteStore;
  };

  componentWillUnmount() {
    FavoriteStore.off('change', this.favoriteHandler);
    MovieStore.off('change', this.movieHandler);
  };

  onRemoveClick(evt) {
    FavoriteStore.remove(evt.target.dataset.id);
  }

  render() {
    console.log(this.state);
    var dom = this.state.list.map(function(mid) {
      var movie = MovieStore.query(mid);
      if (movie) {
        var icon = <span className="glyphicon glyphicon-remove"
                  aria-hidden="true"
                  data-id={movie.id}
                  onClick={(evt) => {this.onRemoveClick(evt)}}>
                 </span>;
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
      } else {
        return '';
      }
    }, this);
    var empty = '';
    if (!this.state.list.length) {
      empty = <div>Empty</div>
    }
    return <div className="movie-list">
            {dom}
            {empty}
           </div>
  }
};
