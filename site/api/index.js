import axios from 'axios';
// import { Cookies } from 'quasar';
import userAPI from './modules/user';
import medicineAPI from './modules/medicine';
import productAPI from './modules/product';
import clientAPI from './modules/client';

const api = axios.create({
  baseURL: 'http://localhost:3333/',
  crossDomain: true,
  timeout: 10000,
});

export const user = userAPI(api);
export const medicine = medicineAPI(api);
export const product = productAPI(api);
export const client = clientAPI(api);
