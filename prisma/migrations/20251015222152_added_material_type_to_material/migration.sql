/*
  Warnings:

  - You are about to drop the column `year` on the `materials` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('FICHA', 'LIVRO', 'EBOOK', 'ARTIGO', 'VIDEO_AULA', 'SLIDES', 'TESTE', 'EXERCICIOS', 'IMAGEM', 'OUTRO');

-- AlterTable
ALTER TABLE "materials" DROP COLUMN "year",
ADD COLUMN     "type" "MaterialType" NOT NULL DEFAULT 'FICHA';
