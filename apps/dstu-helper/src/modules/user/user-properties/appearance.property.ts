import { lodash } from '@dstu_helper/common';

import { PropertyBase } from '../../../../../../libs/common/src/properties';

export type VisibleAppearanceParam = 'show' | 'hidden';
export type ShortedAppearanceParam = 'short' | VisibleAppearanceParam;
export type DegreeAppearanceParam = 'only_high' | VisibleAppearanceParam;
export type ThemeAppearanceParam = 'light' | 'dark';

export type AppearanceParams =
  | VisibleAppearanceParam
  | ShortedAppearanceParam
  | DegreeAppearanceParam
  | ThemeAppearanceParam;

export interface Appearance {
  lesson: {
    type: ShortedAppearanceParam;
  };
  teacher: {
    name: ShortedAppearanceParam;
    degree: DegreeAppearanceParam;
  };
  global: {
    emoji: VisibleAppearanceParam;
    theme: ThemeAppearanceParam;
  };
}

export class AppearanceProperty extends PropertyBase<Appearance, Appearance> {
  private value: Appearance;

  constructor(name: string, value?: Appearance) {
    super(name);
    this.value = value || {
      lesson: {
        type: 'show',
      },
      teacher: {
        name: 'show',
        degree: 'only_high',
      },
      global: {
        emoji: 'show',
        theme: 'dark',
      },
    };
  }

  public get(): Appearance {
    return this.value;
  }

  public set(value: any, path: string): void {
    lodash.set(this.value, path, value);
  }

  public isEquals(value: Appearance): boolean {
    return lodash.isEqual(this.value, value);
  }

  public render(): Appearance {
    return this.value;
  }
}
