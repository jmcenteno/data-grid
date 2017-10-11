/**
 * Book object
 * @param {object} args Map that contains book attributes
 */
export function Book(args) {

  Object.keys(args).forEach((key) => {
    Object.defineProperty(this, key, {
      value: args[key],
      enumerable: true
    });
  });

}

/**
 * Books service contructor
 */
function BooksService() {

  Object.defineProperty(this, 'url', {
    value: 'https://skookum-test-api.herokuapp.com/api/v1/books'
  });

}

BooksService.prototype.get = function get() {

  return new Promise((resolve, reject) => {

    const config = {
      method: 'GET',
      mode: 'cors'
    };

    fetch(this.url, config)
      .then(response => response.json())
      .then((data) => {

        const books = data.map(item => new Book(item));

        resolve(books);

      })
      .catch(error => reject(error));

  });

};

export default new BooksService();
