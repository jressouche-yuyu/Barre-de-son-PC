/**
 * Génération des liens d'affiliation Amazon.
 *
 * Deux cas :
 * - Le produit a un `amazonAsin` connu → lien direct vers la fiche produit.
 * - Sinon → lien de recherche Amazon par nom de produit.
 * Dans les deux cas, le tag partenaire (AFFILIATE.partnerTag) est ajouté.
 *
 * ⚠️ Conformité : les liens d'affiliation doivent porter rel="sponsored nofollow"
 * (géré côté composant), et la page doit mentionner la relation d'affiliation.
 *
 * 📷 Images : l'API Amazon Product Advertising (PA-API) peut fournir les visuels
 * officiels et les prix à jour, mais nécessite un compte Partenaires validé
 * (avec ventes qualifiantes) et des identifiants API stockés en secret. Tant que
 * l'accès PA-API n'est pas en place, on conserve les visuels locaux.
 */
import { AFFILIATE } from '../consts';
import type { Soundbar } from '../data/types';
import { url } from './url';

export function amazonUrl(sb: Pick<Soundbar, 'name' | 'amazonAsin'>): string {
  const tag = AFFILIATE.partnerTag;
  if (sb.amazonAsin) {
    return `${AFFILIATE.marketplace}/dp/${sb.amazonAsin}?tag=${encodeURIComponent(tag)}`;
  }
  const q = encodeURIComponent(sb.name);
  return `${AFFILIATE.marketplace}/s?k=${q}&tag=${encodeURIComponent(tag)}`;
}

/**
 * Lien d'achat « obfusqué » (cloaking) : pointe vers une page de redirection
 * interne `/go/<slug>/` plutôt que vers l'URL Amazon en clair. Avantages :
 * - l'URL marchande (et le tag) n'apparaît pas dans le HTML de la page produit ;
 * - la page /go/ est `noindex` et bloquée dans robots.txt → les moteurs ne
 *   suivent pas le lien d'affiliation et ne l'indexent pas ;
 * - permet de changer la destination (ASIN, marchand) sans toucher au contenu.
 */
export function goUrl(slug: string): string {
  return url(`/go/${slug}`);
}
