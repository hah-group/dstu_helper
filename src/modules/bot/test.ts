import { Injectable } from '@nestjs/common';
import { OnMessage } from './decorator/on-message.decorator';
import { InlineButtonMessage, TextMessage } from './type/message.type';
import { OnInlineButton } from './decorator/on-inline-button.decorator';
import wiki from 'wikijs';

@Injectable()
export class Test {
  @OnMessage('/hi')
  public async test(message: TextMessage): Promise<void> {
    console.log('Test');
    console.log(message.user);
    /* const kb = new KeyboardBuilder()
      .add(new TextButton('Test1', '1').color('primary'))
      .add(new TextButton('Test2', '2').color('positive'))
      .row()
      .add(new TextButton('Test3', '3').color('negative'))
      .add(new LinkButton('Google', 'https://google.com').color('negative'))
      .inline();*/
    //await message.send('test', kb);
  }

  @OnMessage('/l')
  public async long(message: TextMessage): Promise<void> {
    console.log('Long');
    //await message.placeholder('Long started...');
    setTimeout(() => {
      //message.send('Ended');
    }, 2000);
    setTimeout(() => {
      //message.send('Ended 2');
    }, 5000);
  }

  @OnInlineButton('1')
  async tt(message: InlineButtonMessage): Promise<void> {
    console.log(message);
    //await message.alert('test1111');
    //await message.edit('test success', 'edited');
  }

  @OnInlineButton('2')
  async t1t(message: InlineButtonMessage): Promise<void> {
    console.log(message);
    //await message.alert('test2');
    //await message.edit('test success 2', 'edited');
  }

  @OnMessage('Test1')
  async bb() {
    console.log('test1');
  }

  @OnMessage('Wiki')
  async b3(message: TextMessage) {
    const result = await wiki({
      apiUrl: 'https://ru.wikipedia.org/w/api.php',
    }).search('Бытие');
    console.log(result);
    const result2 = await wiki({
      apiUrl: 'https://ru.wikipedia.org/w/api.php',
    }).page(result.results[0]);
    console.log(await result2.summary());
  }
}
