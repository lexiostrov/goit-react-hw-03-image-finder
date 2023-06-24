const url = 'https://pixabay.com/api/';
const KEY = '30177132-bafb3fa6fb95a29f7de2f8c86';
export function getImages(searchText, page) {
  return fetch(
    `${url}?q=${searchText}&key=${KEY}&page=${page}&per_page=12`
  ).then(res => res.json());
}
