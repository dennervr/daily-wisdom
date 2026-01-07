/*
  Warnings:

  - You are about to drop the column `date` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the `translations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dayId,language]` on the table `articles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayId` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sources` on the `articles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_articleId_fkey";

-- DropIndex
DROP INDEX "articles_date_key";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dayId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "sources",
ADD COLUMN     "sources" JSONB NOT NULL;

-- DropTable
DROP TABLE "translations";

-- CreateTable
CREATE TABLE "day" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "day_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "day_date_key" ON "day"("date");

-- CreateIndex
CREATE UNIQUE INDEX "articles_dayId_language_key" ON "articles"("dayId", "language");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
