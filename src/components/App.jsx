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
    const { searchText, page } = this.state;
    const prevSearchText = prevState.searchText.trim();
    const prevPage = prevState.page;

    if (searchText !== prevSearchText || page !== prevPage) {
      if (searchText && page === 1) {
        this.performSearch(searchText, page);
      } else if (searchText && page > 1) {
        this.setState({ isLoading: true }, () => {
          this.performSearch(searchText, page);
        });
      }
    }
  }

  performSearch = (searchText, page) => {
    getImages(searchText, page)
      .then(data => {
        if (data.totalHits === 0) {
          this.setState({ isLoading: false });
          return Notiflix.Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
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
          isLoading: false,
          images: page === 1 ? imgArr : [...prevState.images, ...imgArr],
        }));

        if (page === 1) {
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }

        if (data.totalHits <= page * this.state.per_page) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      })
      .catch(error => {
        this.setState({ isLoading: false, error });
      });
  };

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
    this.setState(prevState => ({
      showModal: !prevState.showModal,
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
