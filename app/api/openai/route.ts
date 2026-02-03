import { NextRequest, NextResponse } from 'next/server'
import { openai, isOpenAIConfigured } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const { action, time, isRunning } = await request.json()

    // System prompt: Position AI as a positive therapist supporting sleep training parents
    const systemPrompt = `You are a warm, empathetic, and positive therapist supporting a parent who is sleep training their baby. Sleep training is one of the most emotionally draining and challenging experiences for parents. Your role is to:

- Provide genuine encouragement and validation
- Acknowledge how difficult sleep training is without minimizing their struggle
- Celebrate small wins and progress, no matter how small
- Remind them that they are doing their best and that's enough
- Be supportive without being overly cheerful or dismissive
- Validate their feelings and normalize the difficulty
- Offer gentle reminders about self-care when appropriate

Keep your messages:
- Short and impactful (1-2 sentences, max 100 words)
- Warm and personal, like talking to a friend
- Specific to their current situation
- Free of clichés or generic advice
- Focused on their strength and resilience

Use emojis sparingly (1-2 max) to add warmth without being excessive.`

    // Build context message based on user action
    let contextMessage = ''
    
    if (action === 'asleep') {
      const minutes = Math.floor(time / 60)
      const hours = Math.floor(time / 3600)
      let timeText = ''
      if (hours > 0) {
        timeText = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes % 60} minute${(minutes % 60) !== 1 ? 's' : ''}`
      } else if (minutes > 0) {
        timeText = `${minutes} minute${minutes > 1 ? 's' : ''}`
      } else {
        timeText = 'a few moments'
      }
      contextMessage = `The parent just celebrated that their baby is asleep! This is a huge win. They tracked ${timeText} of sleep training. This is a moment of success and relief that deserves celebration.`
    } else if (action === 'start') {
      contextMessage = `The parent just started the sleep training timer. They're taking action and beginning this challenging journey.`
    } else if (action === 'stop' || action === 'pause') {
      const minutes = Math.floor(time / 60)
      contextMessage = `The parent paused the timer after ${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : 'a few seconds'}. They may be feeling overwhelmed or need a break.`
    } else if (action === 'reset') {
      contextMessage = `The parent reset the timer. They're starting fresh, which shows resilience and determination.`
    } else if (isRunning) {
      const minutes = Math.floor(time / 60)
      const hours = Math.floor(time / 3600)
      if (hours > 0) {
        contextMessage = `The parent has been tracking sleep training for ${hours} hour${hours > 1 ? 's' : ''} and ${minutes % 60} minute${(minutes % 60) !== 1 ? 's' : ''}. This is a long session and they're showing incredible dedication.`
      } else if (minutes > 0) {
        contextMessage = `The parent has been tracking sleep training for ${minutes} minute${minutes > 1 ? 's' : ''}. They're in the middle of a session and showing persistence.`
      } else {
        contextMessage = `The parent just started tracking and is in the first minute. The beginning is often the hardest part.`
      }
    } else if (time === 0) {
      contextMessage = `The parent is ready to start sleep training. They haven't begun tracking yet but are preparing to take on this challenging task.`
    } else {
      const minutes = Math.floor(time / 60)
      contextMessage = `The parent has ${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : 'some time'} tracked but the timer is paused. They're taking a break.`
    }

    // Generate inspirational message using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: action === 'asleep' 
            ? `Generate a celebratory, joyful message for this parent celebrating that their baby is asleep. This is a major victory! Be genuinely happy for them and acknowledge this success. Context: ${contextMessage}`
            : `Generate a supportive, encouraging message for this parent. Context: ${contextMessage}`,
        },
      ],
      max_tokens: 120,
      temperature: 0.8, // Slightly creative but still focused
    })

    const message = completion.choices[0]?.message?.content || 'You\'re doing great. Keep going! 💪'

    return NextResponse.json({
      message: message.trim(),
    })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate message' },
      { status: 500 }
    )
  }
}

