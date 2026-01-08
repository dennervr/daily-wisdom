import { NextResponse } from 'next/server'
import { getAllAvailableDates } from '@/lib/articleRepository'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dates = await getAllAvailableDates()
    
    return NextResponse.json(
      { dates },
      { 
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching available dates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available dates', dates: [] },
      { status: 500 }
    )
  }
}
