/**
 * Book object
 * @param {object} args Map that contains book attributes { title, author, year, isbn }
 */
export function Book(args) {

  // define object properties
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

  // wrap the XMLHttpRequest with a promise
  return new Promise((resolve, reject) => {

    // configuration for XMLHttpRequest
    const config = {
      method: 'GET',
      mode: 'cors'
    };

    // proceed with the request
    fetch(this.url, config)
      .then(response => response.json()) // response.json() returns a promise
      .then((data) => {

        // create an array of Book objects
        const books = data.map(item => new Book(item));

        resolve(books);

      })
      .catch(error => reject(error));

  });

};

export default new BooksService();
