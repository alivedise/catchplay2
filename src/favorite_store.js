import MovieData from 'movie_data';
import BaseEmitter from 'base_emitter';

class FavoriteStore extends BaseEmitter {
  FAKE_DATA_MODE = true;
  list = [];

  getAll() {
    if (!this.fetched) {
      this.fetchAll();
    }
    return this.list;
  }

  constructor() {
    super();
    this.id = new Date().getTime()
  }

  toggle(id) {
    if (this.list.indexOf(id) >= 0) {
      this.remove(id);
    } else {
      this.add(id);
    }
  }

  add(id) {
    this.list.unshift(id);
    window.localStorage.setItem('cfavlist', JSON.stringify(this.list));
    this.emit('change');
  }

  remove(id) {
    var index = this.list.indexOf(id);
    if (index > -1) {
      this.list.splice(index, 1);
    }
    window.localStorage.setItem('cfavlist', JSON.stringify(this.list));
    this.emit('change');
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

  fetchAll() {
    this.fetched = true;
    return new Promise((resolve) => {
      var list = window.localStorage.getItem('cfavlist');
      if (list) {
        list = JSON.parse(list);
      }
      this.list = list || [];
      console.log(this.id, 'emit');
      this.emit('change');
      resolve(list);
    });
  }
}

var favoriteStore = new FavoriteStore();
export default favoriteStore;