/**
 * Millésime affiché dans les titres et les descriptions.
 *
 * POURQUOI CE FICHIER EXISTE
 * --------------------------
 * Le site annonçait « 2026 » en dur à quatorze endroits : titres de classements,
 * balises title, questions de FAQ, méta-descriptions. Le 1er janvier suivant,
 * toutes ces pages auraient annoncé l'année précédente — c'est le signal le plus
 * lisible qu'un site n'est plus tenu, et il aurait fallu que quelqu'un y pense
 * pour le corriger.
 *
 * Le millésime est donc calculé au build. Comme le déploiement est reconstruit
 * chaque lundi (`.github/workflows/deploy.yml`), le basculement se fait tout
 * seul dans la semaine qui suit le 1er janvier, sans intervention.
 *
 * ⚠ Ne remets JAMAIS une année en dur dans un contenu publié. Un millésime écrit
 * à la main est une date de péremption que personne ne surveille.
 */

/**
 * Année à afficher. Lue à l'exécution du build, en UTC — l'action GitHub tourne
 * en UTC, et un décalage d'un fuseau sur un millésime n'a aucune conséquence.
 */
export function currentYear(): number {
  return new Date().getUTCFullYear();
}

/**
 * Millésime sous forme de chaîne, pour l'interpolation dans un texte.
 * `` `Classement ${annee()} des meilleures…` ``
 */
export function annee(): string {
  return String(currentYear());
}
