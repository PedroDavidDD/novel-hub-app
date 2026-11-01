import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReadingHistoryService } from './reading-history.service';
import { environments } from '../../../../environments/environments';

describe('ReadingHistoryService', () => {
  let service: ReadingHistoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReadingHistoryService],
    });
    service = injectService();
    httpMock = TestBed.inject(HttpTestingController);
  });

  function injectService() {
    return TestBed.inject(ReadingHistoryService);
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reading progress by novelId', () => {
    const mockResponse = {
      statusCode: 1,
      data: {
        id: 'hist-1',
        userId: 'u1',
        novelId: 'n1',
        lastChapterNumber: 5,
        readChapters: [1, 2, 5],
        lastReadAt: '2026-10-31T20:00:00.000Z',
      },
      msg: 'OK',
    };

    service.getProgressByNovelId('n1').subscribe(res => {
      expect(res).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`${environments.baseUrl}/reading-history/novel/n1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return null when novelId is empty', () => {
    service.getProgressByNovelId('').subscribe(res => {
      expect(res).toBeNull();
    });
    httpMock.expectNone(`${environments.baseUrl}/reading-history/novel/`);
  });

  it('should save reading progress', () => {
    const mockResponse = {
      statusCode: 1,
      data: {
        id: 'hist-2',
        userId: 'u1',
        novelId: 'n1',
        lastChapterNumber: 80,
        readChapters: [1, 2, 80],
        lastReadAt: '2026-10-31T21:00:00.000Z',
      },
      msg: 'Progreso de lectura guardado',
    };

    service.saveProgress('n1', 80).subscribe(res => {
      expect(res).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`${environments.baseUrl}/reading-history`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ novelId: 'n1', chapterNumber: 80 });
    req.flush(mockResponse);
  });
});
