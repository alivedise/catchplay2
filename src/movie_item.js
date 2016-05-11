import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import { DragSource, DropTarget } from 'react-dnd';
import FavoriteStore from 'favorite_store';

const type='item';

const itemTarget = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;

    if (draggedId !== props.id) {
      props.moveItem(draggedId, props.id);
    }
  }
};

const itemSource = {
  beginDrag: function(props) {
    return { id: props.id };
  },

  endDrag: function(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
    props.endDrag();
  }
};

function collectTaget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class MovieItem extends BaseClass {
  onRemoveClick(evt) {
    FavoriteStore.remove(this.props.id);
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    var icon = <span className="glyphicon glyphicon-remove"
              aria-hidden="true"
              onClick={(evt) => {this.onRemoveClick(evt)}}>
             </span>;
    return connectDragSource(connectDropTarget(
            <div className="movie-item">
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
          ));
  }
};

module.exports = DragSource(type, itemSource, collectSource)(DropTarget(type,itemTarget,collectTaget)(MovieItem));
