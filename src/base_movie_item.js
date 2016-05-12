import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import FavoriteStore from 'favorite_store';

export default class BaseMovieItem extends BaseClass {
  onFavoriteClick(evt) {
    FavoriteStore.toggle(this.props.id);
  }
  render() {
    var icon;
    if (this.props.favorite) {
      icon = <span
              className="glyphicon glyphicon-heart"
              aria-hidden="true"
              data-id={this.props.id}
              onClick={(evt) => {this.onFavoriteClick(evt)}}>
             </span>
    } else {
      icon = <span className="glyphicon glyphicon-heart-empty"
              aria-hidden="true"
              data-id={this.props.id}
              onClick={(evt) => {this.onFavoriteClick(evt)}}>
             </span>;
    }
    return <div className="movie-item">
            <img src={this.props.img} />
            <div>
              <div className="name">
                {icon}
                <a href={"#movie/" + this.props.id}>
                  {this.props.name}
                </a>
              </div>
            </div>
           </div>
  }
};