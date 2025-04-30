const { validateEmail } = require('./userController');

test('accepts a valid email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

test('rejects email without @', () => {
  expect(validateEmail('testexample.com')).toBe(false);
});

test('rejects empty email', () => {
  expect(validateEmail('')).toBe(false);
});

jest.mock('../../config/db.js', () => ({
    connect: jest.fn().mockResolvedValue('Database connection successful!'),
  }));
  