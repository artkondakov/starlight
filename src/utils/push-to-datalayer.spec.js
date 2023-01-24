import pushToDL from './push-to-datalayer';

describe('pushToDL', () => {
  it('should check for dataLayer exist', () => {
    global.window.dataLayer = null;
    expect(typeof pushToDL({})).toBe('undefined');
  });
  
  it('pushes data to dataLayer', () => {
    global.window.dataLayer = {
      push: jest.fn(),
    };
    pushToDL({})
    expect(global.window.dataLayer.push).toBeCalled();
  });
});