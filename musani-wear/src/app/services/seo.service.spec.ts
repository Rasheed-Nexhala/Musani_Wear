import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleMock: { setTitle: jest.Mock };
  let metaMock: {
    getTag: jest.Mock;
    addTag: jest.Mock;
    updateTag: jest.Mock;
  };

  beforeEach(() => {
    titleMock = { setTitle: jest.fn() };
    metaMock = {
      getTag: jest.fn().mockReturnValue(null),
      addTag: jest.fn(),
      updateTag: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Title, useValue: titleMock },
        { provide: Meta, useValue: metaMock },
      ],
    });
    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setPageTitle', () => {
    it('sets document title', () => {
      service.setPageTitle('Musani Wear - Shop');
      expect(titleMock.setTitle).toHaveBeenCalledWith('Musani Wear - Shop');
    });
  });

  describe('setMeta', () => {
    it('adds meta tag when it does not exist', () => {
      metaMock.getTag.mockReturnValue(null);
      service.setMeta('description', 'Boutique dresses');
      expect(metaMock.addTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Boutique dresses',
      });
      expect(metaMock.updateTag).not.toHaveBeenCalled();
    });

    it('updates meta tag when it exists', () => {
      metaMock.getTag.mockReturnValue({});
      service.setMeta('description', 'Updated description');
      expect(metaMock.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Updated description',
      });
      expect(metaMock.addTag).not.toHaveBeenCalled();
    });
  });

  describe('setOgTags', () => {
    it('adds og:title, og:description, og:type', () => {
      metaMock.getTag.mockReturnValue(null);
      service.setOgTags('Title', 'Description', 'https://example.com/image.jpg');

      expect(metaMock.addTag).toHaveBeenCalledWith({
        property: 'og:title',
        content: 'Title',
      });
      expect(metaMock.addTag).toHaveBeenCalledWith({
        property: 'og:description',
        content: 'Description',
      });
      expect(metaMock.addTag).toHaveBeenCalledWith({
        property: 'og:type',
        content: 'website',
      });
      expect(metaMock.addTag).toHaveBeenCalledWith({
        property: 'og:image',
        content: 'https://example.com/image.jpg',
      });
    });

    it('omits og:image when imageUrl is empty', () => {
      metaMock.getTag.mockReturnValue(null);
      service.setOgTags('Title', 'Description', '');

      const addTagCalls = metaMock.addTag.mock.calls;
      const imageCall = addTagCalls.find(
        (c: unknown[]) => Array.isArray(c) && c[0]?.property === 'og:image'
      );
      expect(imageCall).toBeUndefined();
    });
  });
});
