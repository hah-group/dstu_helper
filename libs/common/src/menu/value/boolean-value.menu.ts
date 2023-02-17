import { ToggleValueMenu } from './toggle-value.menu';
import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';
import { ValueMenuOptions } from '../type/value.menu';

const BooleanTrueValue = Text.Build('boolean-value', { value: false }).render();
const BooleanFalseValue = Text.Build('boolean-value', { value: true }).render();

export class BooleanValueMenu extends ToggleValueMenu {
  constructor(accessor?: string, options?: ValueMenuOptions) {
    super('boolean-value', [BooleanTrueValue, BooleanFalseValue], accessor, options);
  }

  public parse(input: string): boolean {
    return !!input.match(BooleanTrueValue);
  }
}
