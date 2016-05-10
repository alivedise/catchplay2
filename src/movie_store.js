import MovieData from 'movie_data';
import BaseEmitter from 'base_emitter';

export default class MovieStore extends BaseEmitter {
  FAKE_DATA_MODE = true;
  _map = [];

  start() {
    this.fetchAll();
  }

  getAll() {
    return this._map;
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