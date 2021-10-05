// This file contains basic commands for axios. These properties can be used for using axios for front end development


// AXIOS GLOBALS
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';


// GET REQUEST
function getTodos() {
  // Method 1
  axios            // "timeout" is not needed, but it gives error if data is not received within the time period mentioned
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5', { timeout: 5000})       
    .then(res => showOutput(res))
    .catch(err => console.error(err));


  // // Method 2
  // axios
  //   .get('https://jsonplaceholder.typicode.com/todos', {
  //     params: { _limit: 5}
  //   })
  //   .then(res => showOutput(res))
  //   .catch(err => console.error(err));


  // // Method 3: three (key:value) passed to axios
  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   params: {
  //     _limit: 5        // Limits the size of data to 5
  //   }
  // })                  // axios returns a promise
  //   .then(res => showOutput(res))      // shows returned data (res) to page
  //   .catch(err => console.log(err));
}

// POST REQUEST
function addTodo() {
  // Method 1
  axios
    .post('https://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));


  // // Method 2
  // axios({
  //   method: 'post',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   data: {
  //     title: 'New Todo',
  //     completed: false,
  //   }
  // })                  // axios returns a promise
  //   .then(res => showOutput(res))      // shows returned data (res) to page
  //   .catch(err => console.log(err));
}
  
// PUT/PATCH REQUEST
function updateTodo() {
  axios                // Note the "1" attached at the end of URL, it's id of data we want to update
    .put('https://jsonplaceholder.typicode.com/todos/1', {  // patch updates the existing data 
      title: 'Update Todo',                                 // put makes a new data with same id and removes previous data 
      completed: false
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// DELETE REQUEST
function removeTodo() {
  axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')   // deletes data with id = 1
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// SIMULTANEOUS DATA
function getData() {
  // access data from more than one API at once
  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
  .then(res => {           // only run when all of the get calls are fulfilled
    console.log(res[0]);
    console.log(res[1]);   
    showOutput(res[1]);
  })
}

// CUSTOM HEADERS
function customHeaders() {
  const config ={
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'sometoken'
    }
  }
  axios
    .post('https://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false
    }, config)
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Hello World'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  };
  axios(options).then(res => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  axios
  .get('https://jsonplaceholder.typicode.com/todoss', {
    // validateStatus: function(status) {
    //   return status < 500; // Reject only if status is greater or equal to 500
    // }
  })
  .then(res => showOutput(res))
  .catch(err => {
    if (err.response) {
      // Server responded with a status other than 200 range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers); 
      if (err.response.status === 404) {
        alert('Error: Page Not Found');
      }
    } else if (err.request) {
      // Request was made but there is no response
      console.error(err.request);
    }else {
      console.error(err.message);
    }

  });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
  .get('https://jsonplaceholder.typicode.com/todos', {
    cancelToken: source.token
  })
  .then(res => showOutput(res))
  .catch(thrown => {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message)
    }
  })

  if (true) {
    source.cancel('Request Canceled!');
  }
}

// INTERCEPTING REQUESTS & RESPONSES
// Whenever we make a request and get a response, this information is logged to console
axios.interceptors.request.use(config => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);

  return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES
const axiosInstance = axios.create({
  // Other custom settings
  baseURL: 'https://jsonplaceholder.typicode.com'
});
// axiosInstance.get('/comments?_limit=5').then(res => showOutput(res));


// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
  