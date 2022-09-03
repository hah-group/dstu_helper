export interface VkConversationInfo {
  chat: {
    title: string;
    admin_ids: number[];
  };
  profiles: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
}
