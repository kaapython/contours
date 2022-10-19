import axios from 'axios'

export function queryDataExios(url, method, data) {
  return axios({
    method: method,
    url: url,
    data: data
  })
}