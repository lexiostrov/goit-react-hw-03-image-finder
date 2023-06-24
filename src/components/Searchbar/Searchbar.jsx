import React, { Component } from 'react';
import Notiflix from 'notiflix';
import css from './Searchbar.module.css';
import PropTypes from 'prop-types';
export class Searchbar extends Component {
  state = {
    value: '',
  };

  handleChange = e => {
    this.setState({ value: e.currentTarget.value.toLowerCase() });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.value.trim() === '') {
      return Notiflix.Notify.failure(
        'Request cannot be empty. Please enter a value!'
      );
    }
    this.props.onSubmit(this.state.value.trim());
    this.setState({ value: '' });
  };
  render() {
    return (
      <header className={css.searchbar}>
        <form className={css.form} onSubmit={this.handleSubmit}>
          <button type="submit" className={css.button}>
            <span className={css.span}>Search</span>
          </button>

          <input
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
            value={this.state.value}
          />
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
