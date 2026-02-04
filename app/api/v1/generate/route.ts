import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { prisma } from "@/utils/prisma";

import {
    GoogleGenAI,
    Type,
} from '@google/genai';

async function getPageData(code: string) {
    const response = await fetch(`https://www.screener.in/company/${code}/consolidated/`);
    const data = await response.text();

    const $ = cheerio.load(data);

    const notFoundPage = $("h2").text().includes("Page Not Found");
    if (notFoundPage) {
        throw new Error("Page Not Found");
    }

    const companyInfo = $(".company-info").text();
    const percentageChangeInADay = $(".font-size-12.down.margin-left-4").text();
    const analysis = $("#analysis").text();
    const quarters = $("#quarters").text();
    const profitLoss = $("#profit-loss").text();
    const balanceSheet = $("#balance-sheet").text();
    const cashFlow = $("#cash-flow").text();

    return {
        companyInfo,
        percentageChangeInADay,
        analysis,
        quarters,
        profitLoss,
        balanceSheet,
        cashFlow,
    }
}

function toFloat(value: unknown): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const normalized = value.replace(/,/g, "").replace(/%/g, "").trim();
        const parsed = Number.parseFloat(normalized);
        if (!Number.isNaN(parsed)) return parsed;
    }
    return Number.NaN;
}

function toInt(value: unknown): number {
    if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
    if (typeof value === "string") {
        const normalized = value.replace(/,/g, "").replace(/%/g, "").trim();
        const parsed = Number.parseInt(normalized, 10);
        if (!Number.isNaN(parsed)) return parsed;
    }
    return Number.NaN;
}

export async function POST(request: NextRequest) {
    const { code } = await request.json();

    // check if the analysis is already done for the stock code
    const existingAnalysis = await prisma.prediction.findFirst({
        where: {
            stockCode: code,
            date: {
                gte: new Date(new Date().setDate(new Date().getDate() - 1)),
            },
        },
    });
    if (existingAnalysis) {
        return NextResponse.json({ success: true, data: existingAnalysis, error: null });
    }
    
    let pageData: any;
    try {
        pageData = await getPageData(code);
    } catch (error: any) {
        return NextResponse.json({ success: false, data: null, error: error.message }, { status: 404 });
    }

    let response: any;
    try {
        response = await aiAnalysis(pageData);
    } catch (error: any) {
        return NextResponse.json({ success: false, data: null, error: error.message }, { status: 500 });
    }

    const data = JSON.parse(response);
    if (!data) {
        return NextResponse.json({ success: false, data: null, error: "Failed to parse response" }, { status: 500 });
    }

    const currentPrice = toFloat(data.currentPrice);
    const priceChange = toFloat(data.priceChange);
    const priceChangePercentage = toFloat(data.priceChangePercentage);
    const predictedPriceIn30Days = toFloat(data.predictedPriceIn30Days);
    const predictedPriceIn90Days = toFloat(data.predictedPriceIn90Days);
    const predictedPriceIn180Days = toFloat(data.predictedPriceIn180Days);
    const accuracy = toInt(data.accuracy);

    if (
        [currentPrice, priceChange, priceChangePercentage, predictedPriceIn30Days, predictedPriceIn90Days, predictedPriceIn180Days].some(
            (n) => !Number.isFinite(n),
        ) ||
        !Number.isFinite(accuracy)
    ) {
        return NextResponse.json(
            {
                success: false,
                data: null,
                error:
                    "AI response had invalid numeric values. Ensure percent/number fields are returned as numbers (not strings like '80%' or '3,225').",
            },
            { status: 500 },
        );
    }

    await prisma.prediction.create({
        data: {
            stockCode: data.stockCode,
            stockName: data.stockName,
            currentPrice,
            priceChange,
            priceChangePercentage,
            predictedPriceIn30Days,
            predictedPriceIn90Days,
            predictedPriceIn180Days,
            signal: data.signal,
            accuracy,
            result: data.result,
            date: new Date(),
        },
    });

    return NextResponse.json({ success: true, data: data, error: null });
}

async function aiAnalysis(pageData: any) {

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
        thinkingConfig: {
            thinkingBudget: 0,
        },
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            required: ["stockCode", "stockName", "currentPrice", "priceChange", "priceChangePercentage", "predictedPriceIn30Days", "predictedPriceIn90Days", "predictedPriceIn180Days", "signal", "accuracy", "result"],
            properties: {
                stockCode: {
                    type: Type.STRING,
                },
                stockName: {
                    type: Type.STRING,
                },
                currentPrice: {
                    type: Type.NUMBER,
                },
                priceChange: {
                    type: Type.NUMBER,
                },
                priceChangePercentage: {
                    type: Type.NUMBER,
                },
                predictedPriceIn30Days: {
                    type: Type.NUMBER,
                },
                predictedPriceIn90Days: {
                    type: Type.NUMBER,
                },
                predictedPriceIn180Days: {
                    type: Type.NUMBER,
                },
                signal: {
                    type: Type.STRING,
                },
                accuracy: {
                    type: Type.NUMBER,
                },
                result: {
                    type: Type.STRING,
                },
            },
        },
        systemInstruction: [
            {
                text: `Role: You are an expert Fundamental Equity Analyst specializing in the Indian Stock Market. Your goal is to extract and analyze data from a Screener.in page to determine price movement potential.
        
        Task:
        1. Data Extraction: Identify the stock name, code, current price, and historical performance.
        2. Analysis: Evaluate the stock across 5 dimensions: Profitability (ROCE/ROE), Growth (Sales vs Profit), Solvency (Debt/Equity/Pledging), Valuation (P/E vs Median/Industry), and Quality of Earnings (CFO vs Net Profit).
        3. Prediction: Based on the valuation gap (Current P/E vs Median P/E) and the PEG ratio, calculate estimated price targets for 30, 90, and 180 days.
        
        Schema Mapping Instructions:
        - stockCode & stockName: Extract from the page header.
        - currentPrice: The 'Current Price' value.
        - priceChange: Price change in a day, available in company info section.
        - signal: Must be "STRONG BUY", "BUY", "HOLD", "SELL", or "STRONG SELL".
        - accuracy: Provide a percentage (e.g., "85%") based on the availability and consistency of 10-year historical data.
        - predictedPriceInXDays: Calculate these by applying the growth rate and valuation mean reversion.
        - result: Provide a concise 3-4 sentence fundamental justification for the signal.
                
        Constraint: Do not provide financial advice. All predictions are mathematical projections based on the provided fundamental metrics.`
            }
        ],
    };
    const model = 'gemini-flash-lite-latest';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `Company Info: ${pageData.companyInfo}\n Percentage Change in a Day: ${pageData.percentageChangeInADay}\n Analysis: ${pageData.analysis}\nQuarters: ${pageData.quarters}\nProfit Loss: ${pageData.profitLoss}\nBalance Sheet: ${pageData.balanceSheet}\nCash Flow: ${pageData.cashFlow}`,
                },
            ],
        },
    ];
    let response: any;
    try {
        response = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });
    } catch (error) {
        console.error(error); 
        throw new Error("Failed to generate analysis");
    }

    let result = "";
    for await (const chunk of response) {
        result += chunk.text;
    }

    return result;
}