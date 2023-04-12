import { Type } from '@nestjs/common';
import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

import { PropertiesContainerBase } from './properties-container.base';

export class PropertiesTransformer<T extends PropertiesContainerBase<any>> implements ValueTransformer {
  constructor(private readonly container: Type<T>) {}

  public to(properties: T | undefined): any {
    return properties?.render() || new this.container().render();
  }

  public from(params?: any): T {
    return new this.container(params);
  }
}
