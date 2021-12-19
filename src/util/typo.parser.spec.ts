import { TypoParser } from './typo.parser';
import { AT_ACTIVATION, WHAT_ACTIVATION } from './text.processor';
import { lessonOrderInterval } from './lesson-order-interval';

describe('Typo parser', () => {
  //let service: TtService;

  /*beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtService],
    }).compile();

    service = module.get<TtService>(TtService);
  });*/

  it('шо по парам', () => {
    console.log(lessonOrderInterval[0].start.toISOString());
    const result = TypoParser.parse('шо по парам');
    expect(!!result.match(WHAT_ACTIVATION)).toBe(true);
  });

  it('шо по праам', () => {
    const result = TypoParser.parse('шо по праам');
    expect(!!result.match(WHAT_ACTIVATION)).toBe(true);
  });

  it('чтл пр праам', () => {
    const result = TypoParser.parse('чтл пр праам');
    expect(!!result.match(WHAT_ACTIVATION)).toBe(true);
  });

  it('чтл у нас завтар', () => {
    const result = TypoParser.parse('чтл у нас завтар');
    expect(!!result.match(WHAT_ACTIVATION)).toBe(true);
  });

  it('пры на хавтар', () => {
    const result = TypoParser.parse('пры н хавтар');
    console.log(result);
    expect(!!result.match(AT_ACTIVATION)).toBe(true);
  });
});
