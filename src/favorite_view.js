import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import FavoriteStore from 'favorite_store';
import MovieStore from 'movie_store';
import Service from 'service';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragSource, DropTarget } from 'react-dnd';
import MovieItem from 'movie_item';
import update from 'react/lib/update';

export default class FavoriteView extends BaseClass {
  constructor(props) {
    super(props);

    this.moveItem = this.moveItem.bind(this);
    this.endDrag = this.endDrag.bind(this);
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


  moveItem(id, afterId) {
    const { list } = this.state;

    const item = list.filter(i => i === id)[0];
    const afterItem = list.filter(i => i === afterId)[0];
    const itemIndex = list.indexOf(item);
    const afterIndex = list.indexOf(afterItem);

    this.setState(update(this.state, {
      list: {
        $splice: [
          [itemIndex, 1],
          [afterIndex, 0, item]
        ]
      }
    }));
  }

  endDrag() {
    console.log('end');
    this.commit();
  }

  commit() {
    FavoriteStore.updateAll(this.state.list);
  }

  componentDidUpdate() {
    console.log('updated');
  }

  render() {
    var dom = this.state.list.map(function(mid) {
      var movie = MovieStore.query(mid);
      if (movie) {
        return <MovieItem key={mid}
                id={mid}
                name={movie.name}
                img={movie.img}
                moveItem={this.moveItem}
                endDrag={this.endDrag}
               />
      } else {
        return '';
      }
    }, this);
    var empty = '';
    if (!this.state.list.length) {
      empty = <div>Empty</div>
    }
    return <div className="movie-list container">
            <div className="row row-centered">
              {dom}
              {empty}
            </div>
           </div>
  }
};

export default DragDropContext(HTML5Backend)(FavoriteView);