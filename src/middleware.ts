import { NextResponse, NextRequest, } from "next/server"

export function middleware(req: NextRequest, res: NextResponse) {

    const isPublic = req.cookies.get("token")?.value
    const server = req.nextUrl.origin
    const fullPath = req.url
    const currentPath = fullPath?.replace(server, '')
    
    if (isPublic && currentPath === "/login") {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (!isPublic && currentPath==="/") {
        return NextResponse.redirect(new URL('/login', req.url))
    }

}

export const config = {
    matcher: ["/login","/"],
}