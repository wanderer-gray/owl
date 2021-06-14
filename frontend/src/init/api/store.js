function ApiException(status, message) {
  this.status = status;
  this.message = message;
}

class ApiStore {
  static errorHandler = null;

  constructor(url) {
    this._url = url;
    this._method = 'get';
    this._query = {};
    this._body = {};
  }

  method(m) {
    this._method = m;

    return this;
  }

  query(q) {
    this._query = q;

    return this;
  }

  body(b) {
    this._body = b;

    return this;
  }

  async executor() {
    const {
      _url,
      _method,
      _query,
      _body
    } = this;
    const url = new URL(`/api/${_url}`, window.location.origin);
    url.search = new URLSearchParams(_query).toString();

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        method: _method,
        body: _method !== 'get' && _method !== 'head' ? JSON.stringify(_body) : undefined
      });

      if (!response.ok) {
        throw new ApiException(response.status, response.statusText);
      }

      const types = response.headers.get('Content-Type');

      if (!types || types.indexOf('application/json') === -1) {
        return;
      }

      const json = await response.json();
      
      return json;
    } catch (error) {
      if (ApiStore.errorHandler) {
        ApiStore.errorHandler(error);
      }
      
      throw error;
    }
  }

  then(done, err) {
    return new Promise((resolve, reject) => {
      this.executor()
        .then((result) => {
          const next = done(result);

          if (!next) {
            resolve(Promise.resolve());
          } else {
            resolve(next);
          }
        })
        .catch((error) => {
          if (err) {
            resolve(err(error));
          } else {
            reject(error);
          }
        });
    });
  }

  catch(err) {
    return new Promise((resolve) => {
      this.executor()
        .then(() => {
          resolve(Promise.resolve());
        })
        .catch((error) => {
          const next = err(error);

          if (!next) {
            resolve(Promise.resolve());
          } else {
            resolve(next);
          }
        });
    });
  }
}

export default ApiStore;
