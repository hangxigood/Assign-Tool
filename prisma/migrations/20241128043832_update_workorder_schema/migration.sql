/*
  Warnings:

  - You are about to drop the column `clientEmail` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryLocationId` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLocationId` on the `WorkOrder` table. All the data in the column will be lost.
  - Added the required column `clientContactName` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startHour` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_deliveryLocationId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_pickupLocationId_fkey";

-- AlterTable
ALTER TABLE "WorkOrder" DROP COLUMN "clientEmail",
DROP COLUMN "deliveryLocationId",
DROP COLUMN "endDate",
DROP COLUMN "pickupLocationId",
ADD COLUMN     "clientContactName" TEXT NOT NULL,
ADD COLUMN     "documentUrl" TEXT,
ADD COLUMN     "endHour" TIMESTAMP(3),
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "noteText" TEXT,
ADD COLUMN     "startHour" TIMESTAMP(3) NOT NULL;
