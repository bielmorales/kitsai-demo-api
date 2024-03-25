import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let fetchMock: jest.Mock;

  beforeAll(async () => {
    // Mock fetch globally
    fetchMock = jest.fn();
    global.fetch = fetchMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    fetchMock.mockClear();
  });

  describe('getTTS', () => {
    it('should return a formatted list of jobs', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            outputFileUrl: 'url1',
            status: 'completed',
            createdAt: '2021-01-01',
          },
        ],
        meta: { lastPage: 1, currentPage: 1 },
      };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.getTTS(1);
      expect(result.data).toEqual(mockResponse.data);
      expect(result.currentPage).toBe(1);
      expect(result.lastPage).toBe(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
    });
  });

  describe('createTTS', () => {
    it('should return success message on successful creation', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ msg: 'Success' }),
      });

      const result = await service.createTTS('Hello World', 'voiceModelId');
      expect(result).toEqual({ msg: 'Success' });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        }),
      );
    });

    it('should throw an error when response is not ok', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
      });

      await expect(
        service.createTTS('Bad Request', 'voiceModelId'),
      ).rejects.toThrow();
    });
  });
});
