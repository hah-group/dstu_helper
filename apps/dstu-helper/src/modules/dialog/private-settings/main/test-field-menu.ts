import { MenuField } from '../../../../../../../libs/common/src/menu/menu-field';

export class TestFieldMenu extends MenuField<boolean> {
  public value = false;

  public parse(value: string): boolean {
    return !!value;
  }

  public render(): string {
    return this.value ? 'Yes' : 'No';
  }
}
