/*
  Warnings:

  - Added the required column `eventType` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" ADD COLUMN     "eventType" TEXT NOT NULL;
