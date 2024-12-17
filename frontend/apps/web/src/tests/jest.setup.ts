import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Reset all mocks automatically between tests
beforeEach(() => {
    jest.resetModules();
});

afterEach(() => {
    jest.clearAllMocks();
});