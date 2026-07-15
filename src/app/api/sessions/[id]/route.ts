import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { summary } = await request.json()

    const session = await prisma.session.update({
      where: { id },
      data: {
        endTime: new Date(),
        summary
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 })
  }
}
