-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "playlistId" TEXT;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
