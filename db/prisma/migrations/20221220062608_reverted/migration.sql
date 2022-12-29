/*
  Warnings:

  - You are about to drop the column `duration` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `vipTicketPrice` on the `eventschedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "eventschedule" DROP COLUMN "vipTicketPrice";
