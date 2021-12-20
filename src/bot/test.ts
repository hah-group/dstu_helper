import { Injectable } from '@nestjs/common';
import { OnMessage } from './on-message.decorator';
import { InlineButtonMessage, TextMessage } from './message.type';
import { KeyboardBuilder } from './keyboard/keyboard.builder';
import { TextButton } from './keyboard/text.button';
import { OnInlineButton } from './on-inline-button.decorator';
import { LinkButton } from './keyboard/link.button';

@Injectable()
export class Test {
  @OnMessage('/hi')
  public async test(message: TextMessage): Promise<void> {
    console.log('Test');
    console.log(message.user);
    const kb = new KeyboardBuilder()
      .add(new TextButton('Test1', '1').color('primary'))
      .add(new TextButton('Test2', '2').color('positive'))
      .row()
      .add(new TextButton('Test3', '3').color('negative'))
      .add(new LinkButton('Google', 'https://google.com').color('negative'))
      .inline();
    await message.send('test', kb);
  }

  @OnMessage('/l')
  public async long(message: TextMessage): Promise<void> {
    console.log('Long');
    await message.placeholder('Long started...');
    setTimeout(() => {
      message.send('Ended');
    }, 2000);
    setTimeout(() => {
      message.send('Ended 2');
    }, 5000);
  }

  @OnInlineButton('1')
  async tt(message: InlineButtonMessage): Promise<void> {
    console.log(message);
    await message.alert('test1111');
    await message.edit('test success', 'edited');
  }

  @OnMessage('Test1')
  async bb() {
    console.log('test1');
  }
}
