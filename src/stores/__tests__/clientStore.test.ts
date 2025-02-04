import { useClientStore } from '../clientStore';

describe('clientStore', () => {
  beforeEach(() => {
    useClientStore.setState({
      isLoggedIn: false,
      token: null,
    });
  });

  it('should initialize with default values', () => {
    const state = useClientStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.token).toBeNull();
  });

  it('should set token and login state', () => {
    const testToken = 'test-token';
    useClientStore.getState().setToken(testToken);
    
    const state = useClientStore.getState();
    expect(state.token).toBe(testToken);
    expect(state.isLoggedIn).toBe(true);
  });

  it('should handle logout', () => {
    // First set a token
    useClientStore.getState().setToken('test-token');
    
    // Then logout
    useClientStore.getState().logout();
    
    const state = useClientStore.getState();
    expect(state.token).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });

  it('should handle null token', () => {
    // First set a token
    useClientStore.getState().setToken('test-token');
    
    // Then set it to null
    useClientStore.getState().setToken(null);
    
    const state = useClientStore.getState();
    expect(state.token).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });
});
