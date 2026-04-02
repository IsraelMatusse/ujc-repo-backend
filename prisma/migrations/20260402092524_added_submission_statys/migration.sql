-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('APROVADO', 'REPROVADO', 'PENDENTE');

-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "submissionStatus" "SubmissionStatus" NOT NULL DEFAULT 'PENDENTE';
