import { Chart } from '@antv/g2';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const ptoductTitles = ['Image', 'Brand', 'Title', 'Price', 'Rating', 'Category'];
  const limit = 10;
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const [productTotal, setProductTotal] = useState(0);
  const [chart, setChart] = useState();


  useEffect(() => {
    getAllProducts();
  }, [page]);

  useEffect(() => {
    if (chart) {
      createChart();
    }
  }, [chart]);

  /**
   * Prepare chart
   */
  const createChart = () => {
    chart.data(products);
    chart.scale('price', {
      values: [0, 500, 1000, 1500]
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
      .color('brand')
      .shape('circle')
      .style({
        fillOpacity: 0.90,
      });

    chart.render();
  }

  /**
   * Fetch all products
   */
  const getAllProducts = async () => {
    const response = await axios.get(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`);
    setProducts(response.data.products);
    setProductTotal(response.data.total);
    setChart(new Chart({
      container: 'container',
      autoFit: true,
      height: 350,
      padding: [40, 100, 80, 80]
    }));
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
    chart.destroy();
  }


  return (
    <div className="App">
      <p>Data visualization App</p>
      <div id="container" />
      <table className="table">
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
                <td className="">
                  <div >
                    <img src={product.thumbnail} style={{ width: '50px', height: '50px' }} alt="" />
                  </div>
                </td>
                <td >
                  <div >
                    <span >
                      {product.brand}
                    </span>
                  </div>
                </td>
                <td >
                  <div >
                    <span>
                      {product.title}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>
                      {product.price}
                    </span>
                  </div>
                </td>

                <td>
                  <div>
                    <span>
                      {product.rating}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>
                      {product.category}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          <li className="page-item" onClick={() => changeInPage(page - 1)}>
            <a className="page-link" href="/#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {[...Array(productTotal / limit)].map((rating, ratingKey) =>
            <span key={ratingKey}>
              <li className="page-item"><a className="page-link" href="/#" onClick={() => changeInPage(ratingKey + 1)}>{ratingKey + 1}</a></li>
            </span>
          )}
          <li className="page-item" onClick={() => changeInPage(page + 1)}>
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

