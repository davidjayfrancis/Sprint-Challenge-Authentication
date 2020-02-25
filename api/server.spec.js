const request = require("supertest");
const server = require("./server.js");
const db = require("../database/dbConfig.js");

describe("server.js", () => {
  it("should set testing environment", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });

  describe("GET /", () => {
    it("should return 200", () => {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.status).toBe(200);
        });
    });

    it("should return {you: 'are cool'", () => {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.body).toEqual({ you: "are cool" });
        });
    });

    it('should return json"', () => {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.type).toBe("application/json");
        });
    });
  });

  describe("POST /api/auth/register", () => {
     it("returns a 201 status", done => {
      return request(server)
        .post("/api/auth/register")
        .send({ "username": "david", "password": "2343" })
        .set("Accept", "application/json")
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('returns json', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ "username": "david", "password": "2343" })
            .set('Content-Type', 'application/json')
            .then(res => {
                expect(res.type).toBe('application/json')
            })
    })
  });

  describe('POST /api/auth/login', () => {
      it('returns status 201', () => {
          return request(server).post('/api/auth/register').send({'username': 'david', 'password': "francis"})
            .set('Content-Type', 'application/json')
            .then(res => {
                return request(server).post('/api/auth/login')
                    .send({'username': 'david', 'password': "francis"})
                    .set('Content-Type', 'application/json')
                    .then(res2 => {
                        expect(res2.status).toBe(200)
                    })
            })
      })
  })
  //http status code
  //format of returned data
});

beforeEach(async () => {
  await db("users").truncate();
});
