-- AlterTable
ALTER TABLE "event" ADD COLUMN     "duration" TEXT;

-- AlterTable
ALTER TABLE "eventschedule" ADD COLUMN     "vipTicketPrice" DOUBLE PRECISION NOT NULL DEFAULT 100;
