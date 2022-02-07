import { Keyboard } from 'vk-io';

export const INLINE_BUTTON_CHECK_ADMIN = 'INLINE_BUTTON_CHECK_ADMIN';

export const CheckAdminKeyboard = (conversationId: number) => {
  return Keyboard.builder()
    .callbackButton({
      label: 'Проверить',
      payload: {
        conversationId,
        type: INLINE_BUTTON_CHECK_ADMIN,
      },
    })
    .inline();
};
