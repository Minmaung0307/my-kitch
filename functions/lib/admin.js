// Authorization is based on a verified Google token, never an editable profile.
export const adminEmails = ['minmaung0307@gmail.com', 'panna07@gmail.com'];
export function isAdminToken(token) {
  return token?.email_verified === true && token?.firebase?.sign_in_provider === 'google.com'
    && typeof token.email === 'string' && adminEmails.includes(token.email.toLowerCase());
}

// `user.admin` is computed from a verified token by the caller, never from form data.
export function canEditRecipe(recipe,user){
 return Boolean(user?.uid&&(user.admin===true||recipe?.authorId===user.uid));
}
