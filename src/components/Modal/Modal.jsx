import css from './Modal.module.css';
import React, { Component } from 'react';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.hendleKeyDown);
  }
  handleKeyDown = e => {
    if (e.code === 'Escape') {
      console.log('close modal');
      this.props.onClose();
    }
  };

  hendleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    return (
      <div className={css.overlay} onClick={this.hendleBackdropClick}>
        <div className={css.modal}>
          <img src={this.props.largeImage} alt="img" />
        </div>
      </div>
    );
  }
}
