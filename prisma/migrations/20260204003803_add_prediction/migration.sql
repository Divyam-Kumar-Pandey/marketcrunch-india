-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "stockCode" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "priceChange" DOUBLE PRECISION NOT NULL,
    "priceChangePercentage" DOUBLE PRECISION NOT NULL,
    "predictedPriceIn30Days" DOUBLE PRECISION NOT NULL,
    "predictedPriceIn90Days" DOUBLE PRECISION NOT NULL,
    "predictedPriceIn180Days" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signal" TEXT NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prediction_stockCode_date_idx" ON "Prediction"("stockCode", "date");
