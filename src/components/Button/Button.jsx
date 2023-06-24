import PropTypes from 'prop-types';
import css from './Button.module.css';
function Button({ nextPage }) {
  return (
    <button className={css.Button} type="button" onClick={nextPage}>
      Load more
    </button>
  );
}

Button.propTypes = {
  nextPage: PropTypes.func.isRequired,
};

export default Button;
