import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.isRemoval === 'true') {
      this.props.onRemove(this.props.Track);
    } else {
      this.props.onAdd(this.props.Track);
    }
    e.preventDefault();
  }

  renderAction() {
    if (this.props.isRemoval === 'true') {
      return '-';
    } else {
      return '+';
    }
  }

  render() {
    return (
        <div className="Track">
          <div className="Track-information">
            <h3>{this.props.Track.song}</h3>
            <p>{this.props.Track.artist} | {this.props.Track.album}</p>
          </div>
          <a className="Track-action" onClick={this.handleClick.bind(this)}>
            {this.renderAction()}
          </a>
        </div>
    );
  }
};

export default Track;
