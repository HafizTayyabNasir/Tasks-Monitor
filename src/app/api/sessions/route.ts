import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

export async function POST() {
  try {
    const token = (await cookies()).get('session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(token)
    
    const session = await prisma.session.create({
      data: {
        userId: payload.id as string,
        startTime: new Date()
      }
    })
    
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 })
  }
}
