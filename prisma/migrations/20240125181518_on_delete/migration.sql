-- DropForeignKey
ALTER TABLE "columns" DROP CONSTRAINT "columns_creator_id_fkey";

-- AddForeignKey
ALTER TABLE "columns" ADD CONSTRAINT "columns_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
