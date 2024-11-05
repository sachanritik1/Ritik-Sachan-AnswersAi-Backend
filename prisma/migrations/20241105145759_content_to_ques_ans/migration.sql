/*
  Warnings:

  - You are about to drop the column `content` on the `Question` table. All the data in the column will be lost.
  - Added the required column `answerString` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionString` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "content",
ADD COLUMN     "answerString" TEXT NOT NULL,
ADD COLUMN     "questionString" TEXT NOT NULL;
