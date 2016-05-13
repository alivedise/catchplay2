import MovieData from './movie_data';
import BaseEmitter from './base_emitter';

class MovieStore extends BaseEmitter {
  FAKE_DATA_MODE = true;
  _map = [];

  getAll() {
    if (!this._map.length) {
      this.fetchAll();
    }
    return this._map;
  }

  query(id) {
    return this._map.find((movie) => {
      if (id === movie.id) {
        return true;
      }
    })
  }

  get(id) {
    // XXX: asynchronous
    return new Promise((resolve) => {
      var result;
      if (this.FAKE_DATA_MODE) {
        result = MovieData.slice().find(function(movie) {
          if (movie.id === id) {
            return true;
          } else {
            return false;
          }
        });
      }
      resolve(result);
    });
  }

  search(keyword) {
    return new Promise((resolve) => {
      var result;
      if (this.FAKE_DATA_MODE) {
        result = MovieData.filter(function(movie) {
          console.log(movie);
          if (movie.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
            return true;
          } else if (movie.outline.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
            return true;
          } else if (movie.director.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
            return true;
          } else if (movie.actors.some((a) => {return (a.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)})) {
            return true;
          } else {
            return false;
          }
        });
      }
      resolve(result || []);
    });
  }

  fetchAll() {
    return new Promise((resolve) => {
      if (this.FAKE_DATA_MODE) {
        this._map = MovieData.slice();
        this.emit('change');
        resolve();
      } else {
        // XXX: Remote data in firebase.
      }
    });
  }
}

var movieStore = new MovieStore();
export default movieStore;