# 🚀 Skill : Consistance Design & UX (Local vers Cloud)

En tant qu'expert UX, j'ai défini ce standard pour garantir que l'utilisateur final voie exactement ce que vous avez conçu en local sur Smartcodai V2.

## 🕵️‍♂️ Pourquoi le design "se mélange" en Production ?

### 1. Le Piège de la Purge CSS (Tailwind)
**Cause** : En mode production, Tailwind analyse votre code pour supprimer toutes les classes CSS non utilisées.
**Le Problème** : Si vous utilisez des classes générées dynamiquement (ex: `text-${color}-500`) ou si vous avez des fichiers hors du dossier `src/`, Tailwind "purge" ces styles car il ne les trouve pas dans sa liste.
**Solution** : Toujours vérifier le tableau `content` dans `tailwind.config.js`.

### 2. Différence d'Environnement (Node vs Docker)
**Cause** : Le mode "Development" de Next.js injecte du CSS en temps réel. Le mode "Production" compile tout dans des fichiers statiques optimisés (Mini-fichiers).
**Le Problème** : Certaines priorités CSS (Z-index, Flexbox) peuvent changer lors de la minification.
**Solution** : Utiliser des classes utilitaires explicites plutôt que des styles complexes imbriqués.

### 3. La "Cascade de Cache"
**Cause** : Votre navigateur ou le serveur (Nginx) garde l'ancien CSS en mémoire.
**Le Problème** : Vous voyez le nouveau HTML avec l'ancien CSS.
**Solution** : Forcer le rafraîchissement (`Ctrl+F5`) et s'assurer que Docker reconstruit sans cache (`--no-cache`).

---

## 📋 Check-list Visual Parity (Post-Déploiement)

Avant de déclarer un déploiement "Réussi", vérifiez ces points sur le Cloud :
- [ ] **Alignement Sidebar** : La marge de gauche (`md:ml-64`) est-elle respectée sur Desktop ?
- [ ] **Position du Header** : Les éléments (Globe, Theme) sont-ils à leur place sans chevauchement ?
- [ ] **Polices & Icônes** : Les polices Syne/Inter et les icônes Lucide chargent-elles correctement ?
- [ ] **Mode Sombre/Clair** : Le basculement est-il fluide et sans scintillement ?

---

## 🛡️ Règles d'Or pour le Développeur UX
1. **Ne jamais supposer** : "Ça marche en local" ≠ "Ça marchera sur le Cloud".
2. **Double Vérification des Chemins** : Utiliser `@/` pour les imports pour éviter les erreurs de chemins relatifs.
3. **Build Local en mode Prod** : De temps en temps, lancez `npm run build` et `npm run start` en local pour voir le résultat réel avant de pousser sur le VPS.

---

> [!TIP]
> Si le design semble "mélangé", la première action est de vérifier les logs Docker pour voir si le build CSS a rencontré des erreurs.
