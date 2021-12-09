import { Keyboard } from 'vk-io';

export const BUTTON_CHECK_ADMIN = 'BUTTON_CHECK_ADMIN';

export const CheckAdminKeyboard = (conversationId: number) => {
  return Keyboard.builder()
    .callbackButton({
      label: 'Проверить',
      payload: {
        conversationId,
        type: BUTTON_CHECK_ADMIN,
      },
    })
    .inline();
};
