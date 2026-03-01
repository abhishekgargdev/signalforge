import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type, model } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not yet populated
      return NextResponse.json({
        success: true,
        text: `[SignalForge Intelligence Engine - Fallback]\n\nBased on the analysis of "${prompt?.slice(0, 80) || 'topic'}", here is the synthesized technical response:\n\n1. Technical Insight: Speculative decoding and asynchronous tiering deliver up to 3.8x throughput improvements when memory bus bottlenecks are decoupled.\n2. Architecture Invariant: Prioritize distributed WAL durability with lightweight read replicas.\n3. Content Angle: Publish an engineering breakdown contrasting local caches with distributed ephemeral volumes.`,
        mode: "offline_fallback",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    let systemInstruction = "You are SignalForge, a world-class technology intelligence and engineering brand architect. Provide high-density, authoritative, zero-slop technical insights.";

    if (type === "comment") {
      systemInstruction = "You are a senior staff software engineer crafting a thoughtful, constructive, anti-spam comment for a technical LinkedIn/X post. Deliver a sharp technical insight, a personal perspective, or a constructive architectural question without self-promotion.";
    } else if (type === "article_outline") {
      systemInstruction = "You are an elite technical publication editor. Outline a deep-dive technical article with clear architectural sections, trade-off comparisons, code block suggestions, and key takeaways.";
    }

    const response = await ai.models.generateContent({
      model: model || "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({
      success: true,
      text: response.text || "No response generated.",
      mode: "live_gemini",
    });
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate AI response",
      },
      { status: 500 }
    );
  }
}
