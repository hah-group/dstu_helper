import { Content } from '../../content';
import { ValueMenuOptions } from '../type';
import { ToggleValueMenu } from './toggle-value.menu';

const BooleanTrueValue = Content.Build('boolean-value', { value: false });
const BooleanFalseValue = Content.Build('boolean-value', { value: true });

export class BooleanValueMenu extends ToggleValueMenu {
  constructor(accessor?: string, options?: ValueMenuOptions) {
    super('boolean-value', BooleanValueMenu.validValues, accessor, options);
  }

  private static validValues(): string[] {
    return [BooleanTrueValue.render(), BooleanFalseValue.render()];
  }

  public parse(input: string): boolean {
    const trueValue = BooleanTrueValue.render();
    return !!input.match(trueValue);
  }
}
