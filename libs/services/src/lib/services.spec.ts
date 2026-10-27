import { apiService, ApiService } from './services';

describe('services', () => {
  it('should create an ApiService instance with all module services', () => {
    const service = new ApiService();
    expect(service).toBeDefined();
    expect(service.auth).toBeDefined();
    expect(service.sadhana).toBeDefined();
    expect(service.announcement).toBeDefined();
    expect(service.seva).toBeDefined();
  });

  it('should export singleton apiService', () => {
    expect(apiService).toBeDefined();
  });
});
