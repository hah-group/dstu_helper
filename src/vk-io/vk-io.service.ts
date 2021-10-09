import { Inject, Injectable } from '@nestjs/common';
import { VK_IO_OPTION } from './constants';
import { IAPIOptions } from 'vk-io/lib/api/api';
import { VK } from 'vk-io';

@Injectable()
export class VkIoService extends VK {
  constructor(@Inject(VK_IO_OPTION) options: IAPIOptions) {
    super(options);
  }
}
