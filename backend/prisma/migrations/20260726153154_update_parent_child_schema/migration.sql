/*
  Warnings:

  - You are about to drop the column `child_name` on the `parent_children` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[child_user_id]` on the table `parent_children` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `child_user_id` to the `parent_children` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parent_children" DROP COLUMN "child_name",
ADD COLUMN     "child_user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "parent_children_child_user_id_key" ON "parent_children"("child_user_id");

-- CreateIndex
CREATE INDEX "parent_children_child_user_id_idx" ON "parent_children"("child_user_id");

-- AddForeignKey
ALTER TABLE "parent_children" ADD CONSTRAINT "parent_children_child_user_id_fkey" FOREIGN KEY ("child_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
