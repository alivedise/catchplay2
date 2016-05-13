import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import FavoriteStore from 'favorite_store';
import MovieStore from 'movie_store';
import Service from 'service';
import BaseMovieItem from 'base_movie_item';

export default class SearchView extends BaseClass {
  DEBUG = true
  name = 'SearchView'
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      favorites: FavoriteStore.getAll()
    }
    this.favoriteHandler = () => {
      console.log('14444');
      this.setState({
        favorites: FavoriteStore.getAll()
      })
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  componentDidMount() {
    MovieStore.search(this.props.keyword).then((result) => {
      if (!ReactDOM.findDOMNode(this)) {
        return;
      }
      console.log(result);
      this.setState({
        list: result
      })
    });
    FavoriteStore.on('change', this.favoriteHandler);
    window.s = this;
  };

  componentWillUnmount() {
    FavoriteStore.off('change', this.favoriteHandler);
  };

  componentDidUpdate() {
    console.log('updated');
  }

  render() {
    var dom = this.state.list.map(function(movie) {
      return <BaseMovieItem key={movie.id}
                id={movie.id}
                name={movie.name}
                img={movie.img}
                favorite={this.state.favorites.indexOf(movie.id) >= 0}
               />
    }, this);
    var empty = '';
    if (!this.state.list.length) {
      empty = <div>No result</div>
    }
    return <div className="movie-list container">
            <div className="row row-centered">
              {dom}
              {empty}
            </div>
           </div>
  }
};
