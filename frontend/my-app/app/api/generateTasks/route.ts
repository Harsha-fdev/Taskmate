import { NextRequest, NextResponse } from 'next/server';

// Fallback function that generates tasks locally without using external API
function generateLocalTasks(topic: string) {
  // Define some general task templates that can work for most topics
  const taskTemplates = [
    `Research about ${topic}`,
    `Create a plan for ${topic}`,
    `Schedule time for ${topic}`,
    `Find resources related to ${topic}`,
    `Review progress on ${topic}`,
    `Share findings about ${topic}`,
    `Get feedback on ${topic}`,
    `Organize notes on ${topic}`,
    `Set goals for ${topic}`,
    `Connect with others interested in ${topic}`
  ];

  // Select 5 random templates (or all if less than 5 templates)
  const selectedTemplates = [...taskTemplates]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  // Format as task objects
  return selectedTemplates.map(title => ({
    title,
    completed: false
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    // Check if we should use local fallback (can be controlled via env variable)
    const useLocalFallback = process.env.USE_LOCAL_FALLBACK === 'true';

    if (useLocalFallback) {
      const tasks = generateLocalTasks(topic);
      return NextResponse.json({
        tasks,
        source: 'local',
        note: 'Using local task generation due to configuration setting'
      });
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [
            {
              role: 'user',
              content: `Generate a JSON array of 5 tasks related to "${topic}". Each task should include "title" and "completed" (set to false). Respond with raw JSON only.`,
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("OpenRouter response:", JSON.stringify(data, null, 2));

      // Check for error responses from OpenRouter
      if (data.error) {
        console.error("OpenRouter error:", data.error);

        // Handle rate limiting errors specifically
        if (
          data.error.type === 'rate_limit_exceeded' ||
          data.error.message?.includes('rate limit') ||
          data.error.message?.includes('Rate limit')
        ) {
          console.log("Rate limit exceeded, using local fallback");
          const tasks = generateLocalTasks(topic);
          return NextResponse.json({
            tasks,
            source: 'local',
            rateLimited: true,
            note: 'Using local task generation due to API rate limits'
          });
        }

        throw new Error(`OpenRouter error: ${data.error.message || data.error}`);
      }

      // OpenRouter API returns content in choices[0].message.content
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        console.log("No content received, using local fallback");
        const tasks = generateLocalTasks(topic);
        return NextResponse.json({
          tasks,
          source: 'local',
          note: 'Using local task generation due to empty API response'
        });
      }

      // Clean up JSON string
      const cleaned = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      try {
        const tasks = JSON.parse(cleaned);
        return NextResponse.json({
          tasks,
          source: 'api'
        });
      } catch (parseError: unknown) {
        console.error("JSON parse error:", parseError);

        // Fallback to local generation
        const tasks = generateLocalTasks(topic);
        return NextResponse.json({
          tasks,
          source: 'local',
          note: 'Using local task generation due to JSON parsing error'
        });
      }
    } catch (apiError: unknown) {
      console.error("API request error:", apiError);

      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);

      // Fallback to local generation for any API errors
      const tasks = generateLocalTasks(topic);
      return NextResponse.json({
        tasks,
        source: 'local',
        error: errorMessage,
        note: 'Using local task generation due to API error'
      });
    }
  } catch (error: unknown) {
    console.error('Overall error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      error: errorMessage || 'Internal Server Error',
      hint: 'Check server logs for full details'
    }, { status: 500 });
  }
}
