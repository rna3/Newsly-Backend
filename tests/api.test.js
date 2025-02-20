import request from 'supertest';
import app from '../app.js';
import pool from '../db/index.js';

describe('Backend API Tests', () => {
  // Define a test user for authentication-related tests.
  const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "Password123" // meets strength requirements
  };
  let cookie; // to store the cookie from login response
  let favoriteId;
  let commentId;
  const sampleArticle = {
    article_id: "https://example.com/article",
    title: "Example Article",
    url: "https://example.com/article",
    image_url: "https://example.com/image.jpg",
    published_at: new Date().toISOString(),
    source_name: "Example Source",
    content: "This is a test article content."
  };

  // Clean up test user before and after tests.
  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    // Clean up favorites and comments if needed.
    await pool.end();
  });

  describe('Authentication Endpoints', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      // The updated endpoint returns { user: {...} }
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
    });

    it('should login the user and set an HTTP-only cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
      // Capture the set-cookie header array
      cookie = res.headers['set-cookie'];
      expect(cookie).toBeDefined();
    });
  });

  describe('Favorites Endpoints', () => {
    it('should not allow access to favorites without cookie', async () => {
      const res = await request(app).get('/api/favorites');
      expect(res.statusCode).toEqual(401);
    });

    it('should add a favorite with valid cookie', async () => {
      const res = await request(app)
        .post('/api/favorites')
        .set('Cookie', cookie)
        .send(sampleArticle);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      favoriteId = res.body.id;
    });

    it('should retrieve favorites for the user', async () => {
      const res = await request(app)
        .get('/api/favorites')
        .set('Cookie', cookie);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      const fav = res.body.find(f => f.id === favoriteId);
      expect(fav).toBeDefined();
    });

    it('should delete the favorite', async () => {
      const res = await request(app)
        .delete('/api/favorites')
        .set('Cookie', cookie)
        .send({ ids: [favoriteId] });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('deleted');
    });
  });

  describe('Comments Endpoints', () => {
    const articleId = sampleArticle.article_id;
    it('should add a comment', async () => {
      const res = await request(app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({ article_id: articleId, comment: "Test comment" });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username');
      commentId = res.body.id;
    });

    it('should retrieve comments for the article', async () => {
      const res = await request(app)
        .get(`/api/comments?article_id=${encodeURIComponent(articleId)}`)
        .set('Cookie', cookie);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      const comment = res.body.find(c => c.id === commentId);
      expect(comment).toBeDefined();
    });

    it('should update a comment', async () => {
      const res = await request(app)
        .patch(`/api/comments/${commentId}`)
        .set('Cookie', cookie)
        .send({ comment: "Updated comment" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.comment).toEqual("Updated comment");
    });

    it('should delete a comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Cookie', cookie);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Comment deleted successfully');
    });
  });
});
