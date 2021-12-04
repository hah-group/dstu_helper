export interface VkBotInterface {
  sendMessage(
    userId: number | string,
    message: string,
    attachment?: string | string[],
    keyboard?: VkBotKeyboard,
    sticker?: number | string,
  ): Promise<{
    peer_id: number;
    message_id: number;
    conversation_message_id: number;
    error?: any;
  }>;

  execute(method: string, settings: any): Promise<any>;

  use(middleware: VkBotMiddleware): void;

  on(...middlewares: VkBotMiddleware[]): void;

  command(triggers: string | string[], ...middlewares: VkBotMiddleware[]): this;

  event(triggers: string, ...middlewares: VkBotMiddleware[]): void;

  startPolling(callback?: (err: any) => void): void;

  webhookCallback(req: any, res: any, next?: () => void): any;

  webhookCallback(ctx: any, next?: () => void): any;

  stop(): this;

  start(): this;
}
