/*
  Warnings:

  - Added the required column `title` to the `hoheAttendant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hoheAttendant" ADD COLUMN     "title" TEXT NOT NULL;
