/**
 * Helper de Test pour l'Authentification Smartcodai V2
 * 🔎 Règle : Toujours vider avant de saisir.
 */

export async function safelyInputData(fieldId: string, value: string) {
  // 1. Simulation de la sélection de l'élément (ex: via sélecteur DOM)
  const element = document.getElementById(fieldId) as HTMLInputElement;

  if (element) {
    console.log(`🧹 Nettoyage du champ : ${fieldId}`);
    
    // 2. Vidage explicite
    element.value = ''; 
    
    // 3. Vérification de vacuité
    if (element.value === '') {
      console.log(`✅ Champ vide. Insertion de : ${value}`);
      
      // 4. Insertion des nouvelles données
      element.value = value;
      
      // Simuler l'événement de frappe pour React/Next.js
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.error(`❌ Échec du nettoyage du champ : ${fieldId}`);
    }
  } else {
    console.error(`❌ Élément non trouvé : ${fieldId}`);
  }
}

// Exemple d'utilisation pour un test :
// safelyInputData('email-input', 'admin@smartcodai.com');
// safelyInputData('password-input', 'admin123');
