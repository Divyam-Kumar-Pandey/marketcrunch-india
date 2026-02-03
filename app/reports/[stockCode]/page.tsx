import { prisma } from '@/utils/prisma';
import React from 'react'

const StockReportPage = async ({ params }: { params: Promise<{ stockCode: string }> }) => {
  const { stockCode } = await params;

  const prediction = await prisma.prediction.findFirst({
    where: {
      stockCode: stockCode,
    },
  });
  return (
    <div>StockReportPage {stockCode}</div>
  )
}

export default StockReportPage