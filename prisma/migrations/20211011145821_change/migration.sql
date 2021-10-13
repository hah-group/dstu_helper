/*
  Warnings:

  - You are about to drop the column `timeEnd` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `timeStart` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `upWeek` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `weekDay` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `end` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "timeEnd",
DROP COLUMN "timeStart",
DROP COLUMN "upWeek",
DROP COLUMN "weekDay",
ADD COLUMN     "end" TIMESTAMP NOT NULL,
ADD COLUMN     "start" TIMESTAMP NOT NULL;
