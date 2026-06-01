# 🛠️ Skill : Standards de Test d'Authentification

Ce document définit les règles critiques à appliquer lors de chaque test de connexion ou d'inscription sur Smartcodai V2.

## 📌 La Règle d'Or : "Zéro Résidu"

> [!IMPORTANT]
> **Avant toute insertion** d'informations dans les champs `Email` ou `Mot de passe`, vous devez impérativement vous assurer que ces champs sont **totalement vides**.

### Pourquoi cette règle ?
1. **Éviter la corruption** : Si un test précédent a échoué, des caractères peuvent rester dans le champ.
2. **Gestion de l'autocomplétion** : Les navigateurs peuvent pré-remplir des champs de manière imprévisible.
3. **Fiabilité** : Un test réussi sur un champ "sale" n'est pas un test valide.

---

## 📋 Check-list pour chaque Test

### 1. Tests Manuels
- [ ] Cliquer dans le champ.
- [ ] Tout sélectionner (`Ctrl+A` ou `Cmd+A`).
- [ ] Supprimer (`BackSpace`).
- [ ] Vérifier visuellement que le curseur est au début et le champ vide.
- [ ] Saisir les nouvelles données.

### 2. Tests Automatisés
- [ ] Utiliser une commande `.clear()` ou `.fill('')` avant le `.type()`.
- [ ] Ajouter une assertion pour vérifier que la valeur est `""` avant d'insérer.

---

## 💻 Exemple de Code (Pseudo-code)

```javascript
// MAUVAISE PRATIQUE ❌
input.type("admin@smartcodai.com");

// BONNE PRATIQUE ✅
input.clear(); 
expect(input.value).toBe(""); // Vérification
input.type("admin@smartcodai.com");
```

---

> [!TIP]
> Exécutez cette vérification pour **chaque itération** de test, même si vous pensez que le champ est déjà vide.
