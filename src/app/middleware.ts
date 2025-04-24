import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Fonction middleware pour vérifier l'authentification et la redirection
export function middleware(request: NextRequest) {
  const user = request.cookies.get('user'); // Récupère l'utilisateur de la session (cookie ou autre)

  // Si l'utilisateur essaie d'accéder à une page de profil sans être authentifié
  if (!user && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirection vers la page de connexion
  }

  // Vérifier si l'utilisateur est autorisé à accéder au profil
  if (user) {
    const userData = JSON.parse(user.value);

    // Si l'ID dans l'URL du profil ne correspond pas à l'utilisateur connecté, rediriger vers son propre profil
    const profileId = request.nextUrl.pathname.split('/')[2]; // Récupère l'ID du profil de l'URL
    if (profileId && userData.id !== Number(profileId)) {
      return NextResponse.redirect(new URL(`/profile/${userData.id}`, request.url)); // Redirige vers son propre profil
    }
  }

  return NextResponse.next(); // Permet la requête d'avancer si aucune condition de redirection n'est rencontrée
}

// Définir les pages à surveiller avec ce middleware
export const config = {
  matcher: ['/profile/:path*'], // Applique le middleware uniquement sur les pages /profile
};
