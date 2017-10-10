/**
 * Book object
 * @param {object} args Map that contains book attributes
 */
export function Book(args) {

  this.title = args.title || 'N/A';
  this.author = args.author || 'N/A';
  this.year = args.year || 'N/A';
  this.isbn = args.isbn || 'N/A';

}

/**
 * Books service contructor
 */
function BooksService() {
  this.url = 'https://skookum-test-api.herokuapp.com/api/v1/books'
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
