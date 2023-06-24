import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ images, openModal }) => (
  <ul className={css.ImageGallery}>
    {images.map((image, index) => (
      <ImageGalleryItem openModal={openModal} image={image} key={index} />
    ))}
  </ul>
);
