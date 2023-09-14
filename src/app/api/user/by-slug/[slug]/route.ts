import { getUserBySlug } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug || ''
  const userInNotion = await getUserBySlug(slug)

  if (userInNotion.results.length === 0) {
    return NextResponse.json({ message: `Slug ${slug} is not exist`, data: null }, { status: 400 })
  }

  const result = userInNotion.results[0]
  // @ts-ignore
  const properties = result.properties

  const simpleDataResponse = {}
  for (const [key, value] of Object.entries(properties)) {
    // @ts-ignore
    const type = value.type
    // @ts-ignore
    simpleDataResponse[key] = value[type][0].text.content
  }

  return NextResponse.json({ message: `Found the owner of the slug ${slug}`, data: simpleDataResponse, },)
}