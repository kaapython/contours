import { reactive } from 'vue'
import axios from 'axios'

function queryDataExios(url, method, data) {
  return axios({
    method: method,
    url: url,
    data: data
  })
}

const username = reactive({name: ''});
const errors = [];

queryDataExios(
  // Получение имени пользователя
  '/username',
  'get'
)
  .then((response) => {
    username.name = response.data.username;
})
  .catch(e => {
    errors.push(e);
    console.log('Username errors', errors);
})

export { username }