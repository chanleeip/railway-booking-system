import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';


const publicRoutes = ['/login', '/register','/'];
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_here';
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }



  const authToken = req.cookies.get('authToken');
  // console.log(authToken)
  if (!authToken) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }
  else{
  try {
    // console.log(authToken)
    const decoded = jwtVerify(authToken.value, new TextEncoder().encode(SECRET_KEY)); // Validate the token
    // console.log('Token is valid:', decoded);
    return NextResponse.next(); 
  } catch (error:any) {
    // console.error('Invalid token:', error.message);
    // Redirect to home page on invalid token
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
  }
}
}

  // If authenticated, continue

// Define routes where this middleware should apply
export const config = {
  matcher: '/((?!api|_next|static|favicon.ico).*)',
};