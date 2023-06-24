import css from './ImageGalleryItem.module.css';
export const ImageGalleryItem = ({ image, openModal }) => {
  return (
    <li className={css.ImageGalleryItem} onClick={openModal}>
      <img
        src={image.webformatURL}
        className="ImageGalleryItem-image "
        alt={image.tags}
        name={image.largeImageURL}
        data-large={image.largeImageURL}
      />
    </li>
  );
};
