/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `role` to the `ConversationUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ConversationUser" ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";
