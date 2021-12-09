/*
  Warnings:

  - A unique constraint covering the columns `[userId,conversationId]` on the table `ConversationUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConversationUser_userId_conversationId_key" ON "ConversationUser"("userId", "conversationId");
