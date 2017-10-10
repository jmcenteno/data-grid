import 'babel-polyfill';
import '../scss/styles.scss';

import DataGrid from './components/data-grid';
import Spinner from './components/spinner';
import Books from './services/books';

export default function init() {

  document.getElementById('root').innerHTML = Spinner();

  Books.get()
    .then((data) => {

      // set table columns and rows
      const config = {
        columns: [
          { key: 'title', label: 'Title' },
          { key: 'author', label: 'Author' },
          { key: 'year', label: 'Year' },
          { key: 'isbn', label: 'ISBN' }
        ],
        rows: data
      };

      // create an instance of the DataGrid object
      // pass the DOM element where the table will be rendered
      // pass a configuration object with the columns and rows
      const grid = new DataGrid(
        document.getElementById('root'),
        config
      );

      // add the data grid to the DOM
      grid.init();

    })
    .catch((error) => {
      throw new Error(error);
    });

}

init();
