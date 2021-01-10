const axios = require('axios').default;

describe("GET /api/test/bonjour", function() {

  const data = {};

  beforeAll((done) => {
    
    axios.get('http://localhost:3000/api/test/bonjour')
      .then((response) => {
        data.status = response.status;
        data.data = response.data;
        done();
      })
  })

  it('should have status 200', () => {
    expect(data.status).toBe(200);
  })

  it('should say hello world', () => {
    expect(data.data.message).toBe('Hello World!')
  })

})