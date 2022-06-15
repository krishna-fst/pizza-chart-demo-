import { Chart } from '@antv/g2';
import './App.css';
import React, { useEffect, useState } from 'react';
import ProductService from './services/productService';

function App() {

  const productService = new ProductService();
  const ptoductTitles = ['Image', 'Brand', 'Title', 'Price', 'Rating', 'Category'];
  const limit = 10;
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const [productTotal, setProductTotal] = useState(0);
  const [chart, setChart] = useState();

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    getProduct();
  }, [page, items]);

  useEffect(() => {
    if (chart) {
      createChart();
    }
  }, [chart]);

  /**
 * Fetch all products
 */
  const getAllProducts = async () => {
    const response = await productService.getAllProducts();
    setItems(response.products);
    setProductTotal(response.total);
    setChart(new Chart({
      container: 'container',
      autoFit: true,
      height: 600,
      padding: [40, 100, 80, 80]
    }));
  }

  /**
   * Prepare chart
   */
  const createChart = () => {
    chart.data(items);
    chart.scale('price', {
      values: [0, 500, 1000, 1500, 2000]
    });
    chart.coordinate('polar');
    chart.legend(false);
    chart.axis('brand', {
      grid: {
        alignTick: false,
        line: {
          style: {
            lineDash: [0, 0]
          },
        },
      },
    });
    chart
      .point()
      .adjust('jitter')
      .position('brand*price')
      .color('title')
      .shape('circle')
      .style({
        fillOpacity: 0.90,
      });

    chart.render();
  }

  /**
   * Fetch all products
   */
  const getProduct = async () => {
    const products = items.slice(skip, skip + 10);
    setProducts(products);
  }

  /**
   * called when change in page 
   */
  const changeInPage = (pageNumber) => {
    if (page === pageNumber) {
      return;
    }
    setPage(pageNumber);
    setSkip(limit * pageNumber - limit);
  }


  return (
    <div className="App">
      <h2 className='text-primary'>Data visualization App</h2>
      <div id="container" />
      <table className="table table-striped table-hover table-bordered ">
        <thead>
          <tr>
            {ptoductTitles.map((title, uniqueKey) => (
              <th
                key={uniqueKey}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product, tableKey) => {
            return (
              <tr key={tableKey}>
                <td>
                  <div>
                    <img src={product.thumbnail} style={{ width: '50px', height: '50px' }} alt="" />
                  </div>
                </td>
                <td>
                  {product.brand}
                </td>
                <td >
                  {product.title}
                </td>
                <td>
                  {product.price}
                </td>
                <td>
                  {product.rating}
                </td>
                <td>
                  {product.category}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          <li className="page-item px-1" onClick={() => changeInPage(page - 1)}>
            <a className="page-link" href="/#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {[...Array(productTotal / limit)].map((rating, ratingKey) =>
            <span key={ratingKey}>
              <li className={page === ratingKey + 1 ? 'page-item px-1 active' : 'page-item px-1'} ><a className="page-link" href="/#" onClick={() => changeInPage(ratingKey + 1)}>{ratingKey + 1}</a></li>
            </span>
          )}
          <li className="page-item px-1" onClick={() => changeInPage(page + 1)}>
            <a className="page-link" href="/#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;

