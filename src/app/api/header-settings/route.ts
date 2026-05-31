import { NextResponse } from 'next/server'
import { getProjectorVisible } from '@/lib/registrationStatus'

export async function GET() {
  return NextResponse.json({
    projectorVisible: getProjectorVisible()
  })
}