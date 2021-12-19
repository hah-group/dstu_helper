import { Injectable } from '@nestjs/common';
import { DstuService } from 'src/dstu/dstu.service';
import { UniversityName } from './university-name.enum';
import { UniversityGroup } from './university-group.type';

@Injectable()
export class UniversityService {
  constructor(private readonly dstuService: DstuService) {}

  public async findGroup(query: string, university: UniversityName): Promise<UniversityGroup | undefined> {
    const cleanQuery = this.cleanQuery(query);
    switch (university) {
      case UniversityName.DSTU:
        return this.dstuService.findGroup(cleanQuery);
    }
  }

  private cleanQuery(query: string): string {
    const match = query.match(/([а-яё]+)[ -]*(\d{2})/i);
    let cleanQuery = '';
    if (match && match.length >= 3 && match[1] != '' && !isNaN(parseInt(match[2])))
      cleanQuery = `${match[1].toUpperCase()}${match[2]}`;
    else {
      cleanQuery = cleanQuery.replace(/[ ,\-()]/gi, '');
      cleanQuery = cleanQuery.toUpperCase();
    }

    return cleanQuery;
  }
}
