/*
  Warnings:

  - Added the required column `updating` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyGroup" ADD COLUMN     "updating" BOOLEAN NOT NULL;
