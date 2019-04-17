const request = require('supertest')
const app = require('../app')


/**
 * Testing get all user endpoint
 */
describe('GET /blogsAll/0', function () {
    it('respond with json containing a list of all blogs', function (done) {
        request(app)
            .get('/topBlogs')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});