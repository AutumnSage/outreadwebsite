-- CreateTable
CREATE TABLE "TrendAnalysisResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendAnalysisResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrendAnalysisResponse" ADD CONSTRAINT "TrendAnalysisResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
