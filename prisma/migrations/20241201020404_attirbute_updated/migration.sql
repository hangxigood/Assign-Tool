/*
  Warnings:

  - Made the column `workOrderId` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `WorkOrder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickupLocationId` on table `WorkOrder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryLocationId` on table `WorkOrder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_workOrderId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_deliveryLocationId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_pickupLocationId_fkey";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "workOrderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkOrder" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "pickupLocationId" SET NOT NULL,
ALTER COLUMN "deliveryLocationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_deliveryLocationId_fkey" FOREIGN KEY ("deliveryLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
