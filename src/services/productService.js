import axios from 'axios';

export default class ProductService {
    /**
    * Fetch all products
    */
    getAllProducts = async () => {
        const response = await axios.get(`https://dummyjson.com/products?skip=0&limit=100`);
        return response.data;
    }

}