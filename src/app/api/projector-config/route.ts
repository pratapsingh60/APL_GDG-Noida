import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    accessCode: process.env.PROJECTOR_ACCESS_CODE || 'secret_code'
  })
}