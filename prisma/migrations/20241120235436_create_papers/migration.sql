/*
  Warnings:

  - A unique constraint covering the columns `[paperId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "paperId" INTEGER;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "doi" TEXT NOT NULL,
    "publishDate" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "journal" TEXT NOT NULL,
    "ISSN" TEXT NOT NULL,
    "altmetricsScore" INTEGER NOT NULL,
    "citations" INTEGER NOT NULL,
    "pdfUrl" TEXT,
    "abstractTree" JSONB,
    "metrics" JSONB,
    "vectorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paper_doi_key" ON "Paper"("doi");

-- CreateIndex
CREATE UNIQUE INDEX "Article_paperId_key" ON "Article"("paperId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
