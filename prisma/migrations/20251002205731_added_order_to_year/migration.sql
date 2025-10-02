/*
  Warnings:

  - Added the required column `order` to the `years` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "years" ADD COLUMN     "order" INTEGER NOT NULL;
