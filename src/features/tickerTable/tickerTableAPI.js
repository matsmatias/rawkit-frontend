import axios from 'axios';

import { API_FETCHER } from '../../app/config';


export function fetchConfig() {
  return axios.get(`${API_FETCHER}/config`);
}
