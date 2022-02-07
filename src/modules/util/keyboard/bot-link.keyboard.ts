import { Keyboard } from 'vk-io';

export const BotLinkKeyboard = Keyboard.builder()
  .urlButton({
    label: 'Написать',
    url: `https://vk.me/club${process.env.GROUP_ID}`,
  })
  .inline();
