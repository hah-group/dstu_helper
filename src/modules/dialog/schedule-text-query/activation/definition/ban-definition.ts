export const BanDefinition = /(задали)/i;
export const IsBanWordExist = (message: string) => !!message.match(BanDefinition);
