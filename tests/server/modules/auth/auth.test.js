const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../../../../index');
const should = chai.should;

chai.use(chaiHttp)

describe('Auth Api', () => {
    const user = {
        name: "test12",
        username: "tes12t",
        email: "tes1t2@gmail.com",
        password: "te12st"
    };

    let accessToken;
    let refreshToken;

    describe('should handle tokens', () => {
        it ('should validate a user with local strat', () => {
            const userInfo = {
                email: user.email,
                password: user.password,
                grantType: 'password',
            };

            chai.request(app)
                .post('/auth/token', userInfo)
                .end((err, rest) => {
                    res.should.have.status(201);
                    res.body.should.be.a('string');
                    accessToken = res.body;
                    done();
                });
        });

        it('should send a refresh token', () => {
            const userInfo = {
                email: user.email,
                password: user.password,
                remember: true,
            };

            chai.request(app)
                .post('/auth/token', userInfo)
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('object');
                    res.body.should.have.property('cookie');
                    res.body.cookie.should.have.property('httpOnly').eql(true);
                    refreshToken = res.body.cookie;
                    done();
                });
        });

        it('should validate a refresh token', () => {
            const userInfo = {
                email: user.email,
                password: user.password,
                grantType: 'refresh',
                refreshToken: refreshToken,
            };

            chai.request(app)
                .post('/auth/token', userInfo)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.should.have.property('name').eql('test12');
                    done();
                });
        });
    });
});