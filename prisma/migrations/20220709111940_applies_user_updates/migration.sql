/*
  Warnings:

  - Added the required column `entity` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "entity" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
