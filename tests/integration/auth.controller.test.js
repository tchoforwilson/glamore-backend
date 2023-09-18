import { expect } from 'expect';
import User from '../../models/user.model.js';
import {
  api,
  BASE_URL,
  createUser,
  getHeader,
  closeServer,
} from '../configurations/config.js';

const URL = `${BASE_URL}/users`;

describe('Auth_Controller_Test', () => {
  afterEach(async () => {
    // Delete all users
    await User.deleteMany({});
  });
  after(async () => {
    // Close server
    await closeServer();
  });
  /**
   * ***********************************************************
   * **********************************************************
   * *******************SIGN TESTS**************************
   * ********************************************************
   * ********************************************************
   */
  describe(`POST ${URL}/signup`, () => {
    it('Test_Signup It should return 201 if the user is registered', async () => {
      const res = await api.post(`${URL}/signup`).send({
        name: 'James Brown',
        email: 'james@gmail.com',
        password: 'pass1234',
        passwordConfirm: 'pass1234',
      });
      expect(res.status).toBe(201);
      const data = JSON.parse(res.text);
      expect(data).toHaveProperty('token');
      const { user } = data.data;
      expect(user).toHaveProperty('_id');
    });
  });
  /**
   * ***********************************************************
   * **********************************************************
   * *******************LOGIN TESTS**************************
   * ********************************************************
   * ********************************************************
   */
  describe(`POST ${URL}/login`, () => {
    it('Test_Login It should return 400 if the email or password is not provided', async () => {
      const res = await api
        .post(`${URL}/login`)
        .send({ email: 'james@gmail.com' });
      expect(res.status).toBe(400);
    });
    it('Test_Login It should return 400 if user with email is not found', async () => {
      // 1. Send request
      const res = await api
        .post(`${URL}/login`)
        .send({ email: 'james@gmail.com' });
      // 2. Expect result
      expect(res.status).toBe(400);
    });
  });
  /**
   * ***********************************************************
   * **********************************************************
   * *******************PROTECTED TESTS**************************
   * ********************************************************
   * ********************************************************
   */
  describe(`GET ${URL} Protected`, () => {
    it('Test_Protected It should return 401 for no Token', async () => {
      // 1. Send request with no authorization
      const res = await api.get(`${URL}`);

      // 2. Expect results
      expect(res.status).toBe(401);
    });
    it('Test_Protected It should return 401 for Invalid Token', async () => {
      // 1. Create user to get make token
      const user = await createUser();

      // 2. Make token header
      const header = getHeader(user);

      // 3. Delete user belonging to token
      await User.findByIdAndDelete(user._id);

      // 4. Send request
      const res = await api.get(`${URL}`).set('Authorization', header);

      // 5. Expect result
      expect(res.status).toBe(401);
    });
    it('Test_Protected It should return 401 after user changed password', async () => {
      // 1. Create user to get make token
      const user = await createUser();

      // 2. Make token header
      const header = getHeader(user);

      // 3. Change password

      user.password = 'test1234';
      user.passwordConfirm = 'test1234';
      await user.save();

      // 4. Send request
      const res = await api.get(`${URL}`).set('Authorization', header);

      // 5. Expect result
      expect(res.status).toBe(401);
    });
  });
});
