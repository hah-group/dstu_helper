-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('NOT_CONFIGURED', 'LIMITED', 'FULL');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "status" "ConversationStatus" NOT NULL DEFAULT E'NOT_CONFIGURED';
