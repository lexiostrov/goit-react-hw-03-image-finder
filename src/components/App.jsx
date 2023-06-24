import React, { Component } from 'react';
import Notiflix from 'notiflix';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { Container } from './App.styled';
import { Modal } from './Modal/Modal';
import { getImages } from './Api/api';
import { ImageGallery } from './ImageGallery/ImageGallery';
export class App extends Component {
  state = {
    searchText: '',
    showModal: false,
    images: [],
    page: 1,
    isLoading: false,
    error: null,
    per_page: 12,
    largeImage: null,
  };

  createSearchText = searchText => {
    this.setState({ searchText });
  };

  componentDidUpdate(prevProps, prevState) {
    const searchText = this.state.searchText.trim();

    if (prevState.searchText !== searchText && searchText) {
      this.setState({ isLoading: true, page: 1 });

      getImages(searchText, 1)
        .then(data => {
          if (data.totalHits === 0) {
            this.setState({ isLoading: false });
            return Notiflix.Notify.info(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }
          if (data.totalHits <= 12) {
            this.setState({ isLoading: false });
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
          if (data.status === 'error') {
            return Promise.reject(data.message);
          } else if (data.totalHits > 0) {
            this.setState({ isLoading: false });
            Notiflix.Notify.success(
              `Hooray! We found ${data.totalHits} images.`
            );
          }
          const imgArr = data.hits.map(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id,
              tags,
              webformatURL,
              largeImageURL,
            })
          );
          this.setState({
            images: imgArr,
          });
        })
        .catch(error => {
          this.setState({ error });
        });
    }

    if (prevState.page !== this.state.page && this.state.page !== 1) {
      this.setState({ isLoading: true });
      getImages(searchText, this.state.page)
        .then(data => {
          if (data.totalHits === 0) {
            this.setState({ isLoading: false });
            return Notiflix.Notify.info(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }
          if (Math.floor(data.totalHits / this.state.page) < 12) {
            this.setState({ isLoading: false });
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }

          const imgArr = data.hits.map(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id,
              tags,
              webformatURL,
              largeImageURL,
            })
          );
          this.setState(prevState => ({
            images: [...prevState.images, ...imgArr],
          }));
        })
        .catch(error => {
          this.setState({ error });
        });
    }
  }

  nextPage = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  openModal = e => {
    const largeImage = e.target.dataset.large;

    if (e.target.nodeName === 'IMG') {
      this.setState(({ showModal }) => ({
        showModal: !showModal,
        largeImage: largeImage,
      }));
    }
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };
  onButtonVisible = () => {
    if (
      this.state.images &&
      this.state.images.length < Number(this.state.page * this.state.per_page)
    ) {
      return false;
    } else return true;
  };
  render() {
    const { showModal, images, largeImage, isLoading, error } = this.state;
    return (
      <Container>
        <Searchbar onSubmit={this.createSearchText} />
        {isLoading && <Loader />}
        {error && `${error}`}
        {images && <ImageGallery images={images} openModal={this.openModal} />}
        {this.onButtonVisible() && <Button nextPage={this.nextPage} />}
        {showModal && (
          <Modal onClose={this.toggleModal} largeImage={largeImage} />
        )}
      </Container>
    );
  }
}
