import { renderHook, act } from '@testing-library/react-hooks';
import { useRestAPI } from '../useRestAPI';

describe('useRestAPI', () => {
  // Test for successful API call
  it('should handle successful API calls', async () => {
    // Mock data
    const mockData = { id: 1, name: 'Test' };
    
    // Mock service function
    const mockServiceFn = jest.fn().mockResolvedValue(mockData);
    
    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useRestAPI(mockServiceFn));
    
    // Initially, it should be loading with no data and no error
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    // Wait for the API call to resolve
    await waitForNextUpdate();
    
    // After the API call, it should have data, not be loading, and have no error
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    
    // The service function should have been called once
    expect(mockServiceFn).toHaveBeenCalledTimes(1);
  });
  
  // Test for API call with parameters
  it('should handle API calls with parameters', async () => {
    // Mock data
    const mockData = { id: 2, name: 'Test with params' };
    const mockParams = { userId: 123 };
    
    // Mock service function
    const mockServiceFn = jest.fn().mockResolvedValue(mockData);
    
    // Render the hook with parameters
    const { result, waitForNextUpdate } = renderHook(() => 
      useRestAPI(mockServiceFn, mockParams)
    );
    
    // Wait for the API call to resolve
    await waitForNextUpdate();
    
    // The service function should have been called with the parameters
    expect(mockServiceFn).toHaveBeenCalledWith(mockParams);
    expect(result.current.data).toEqual(mockData);
  });
  
  // Test for API call failure
  it('should handle API call failures', async () => {
    // Mock error
    const mockError = new Error('API call failed');
    
    // Mock service function that rejects
    const mockServiceFn = jest.fn().mockRejectedValue(mockError);
    
    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useRestAPI(mockServiceFn));
    
    // Wait for the API call to reject
    await waitForNextUpdate();
    
    // After the API call fails, it should have an error, not be loading, and have no data
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError.message);
  });
  
  // Test for refetch functionality
  it('should refetch data when refetch is called', async () => {
    // Mock data
    const mockData1 = { id: 3, name: 'Initial data' };
    const mockData2 = { id: 4, name: 'Refetched data' };
    
    // Mock service function that returns different data on second call
    const mockServiceFn = jest.fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);
    
    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useRestAPI(mockServiceFn));
    
    // Wait for the initial API call to resolve
    await waitForNextUpdate();
    
    // Initial data should be loaded
    expect(result.current.data).toEqual(mockData1);
    
    // Call refetch
    act(() => {
      result.current.refetch();
    });
    
    // It should be loading again
    expect(result.current.loading).toBe(true);
    
    // Wait for the refetch to resolve
    await waitForNextUpdate();
    
    // After refetch, it should have the new data
    expect(result.current.data).toEqual(mockData2);
    expect(result.current.loading).toBe(false);
    
    // The service function should have been called twice
    expect(mockServiceFn).toHaveBeenCalledTimes(2);
  });
  
  // Test for dependencies
  it('should refetch when dependencies change', async () => {
    // Mock data
    const mockData = { id: 5, name: 'Dependency test' };
    
    // Mock service function
    const mockServiceFn = jest.fn().mockResolvedValue(mockData);
    
    // Set up a dependency
    let dependency = 1;
    
    // Render the hook with the dependency
    const { waitForNextUpdate, rerender } = renderHook(() => 
      useRestAPI(mockServiceFn, undefined, [dependency])
    );
    
    // Wait for the initial API call to resolve
    await waitForNextUpdate();
    
    // The service function should have been called once
    expect(mockServiceFn).toHaveBeenCalledTimes(1);
    
    // Change the dependency
    dependency = 2;
    
    // Rerender the hook with the new dependency
    rerender();
    
    // Wait for the API call to resolve again
    await waitForNextUpdate();
    
    // The service function should have been called twice
    expect(mockServiceFn).toHaveBeenCalledTimes(2);
  });
});
