/**
 * Script to add exercises to all lessons that are missing them.
 * Usage: npx tsx prisma/seed-exercises.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ExerciseData = {
  exerciseFr: string;
  exerciseEn: string;
  exerciseAr: string;
};

const exercises: Record<string, Record<number, ExerciseData>> = {
  // ─── PHP Lessons 13-15 ───
  php: {
    13: {
      exerciseFr: `<?php\n// Créez un formulaire HTML avec POST qui enregistre les données dans un tableau\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $nom = htmlspecialchars($_POST["nom"]);\n    $email = htmlspecialchars($_POST["email"]);\n    echo "Nom: " . $nom . "<br>";\n    echo "Email: " . $email . "<br>";\n}\n?>\n<!DOCTYPE html>\n<html>\n<body>\n<form method="POST">\n  <label>Nom: <input type="text" name="nom"></label><br>\n  <label>Email: <input type="email" name="email"></label><br>\n  <input type="submit" value="Envoyer">\n</form>\n</body>\n</html>`,
      exerciseEn: `<?php\n// Create an HTML form with POST that saves data to an array\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $name = htmlspecialchars($_POST["name"]);\n    $email = htmlspecialchars($_POST["email"]);\n    echo "Name: " . $name . "<br>";\n    echo "Email: " . $email . "<br>";\n}\n?>\n<!DOCTYPE html>\n<html>\n<body>\n<form method="POST">\n  <label>Name: <input type="text" name="name"></label><br>\n  <label>Email: <input type="email" name="email"></label><br>\n  <input type="submit" value="Submit">\n</form>\n</body>\n</html>`,
      exerciseAr: `<?php\n// أنشئ نموذج HTML مع POST يحفظ البيانات في مصفوفة\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $name = htmlspecialchars($_POST["name"]);\n    $email = htmlspecialchars($_POST["email"]);\n    echo "الاسم: " . $name . "<br>";\n    echo "البريد: " . $email . "<br>";\n}\n?>`,
    },
    14: {
      exerciseFr: `<?php\n// Créez un mini système de panier d'achat\n$panier = [];\n\nfunction ajouterAuPanier(&$panier, $produit, $prix, $qte = 1) {\n    $panier[] = ["produit" => $produit, "prix" => $prix, "qte" => $qte];\n}\n\nfunction calculerTotal($panier) {\n    $total = 0;\n    foreach ($panier as $item) {\n        $total += $item["prix"] * $item["qte"];\n    }\n    return $total;\n}\n\najouterAuPanier($panier, "Pomme", 1.5, 3);\najouterAuPanier($panier, "Banane", 0.8, 5);\n\necho "Total: " . calculerTotal($panier) . " euros\\n";\nforeach ($panier as $item) {\n    echo $item["produit"] . " x" . $item["qte"] . " = " . ($item["prix"] * $item["qte"]) . " euros\\n";\n}\n?>`,
      exerciseEn: `<?php\n// Create a mini shopping cart system\n$cart = [];\n\nfunction addToCart(&$cart, $product, $price, $qty = 1) {\n    $cart[] = ["product" => $product, "price" => $price, "qty" => $qty];\n}\n\nfunction calculateTotal($cart) {\n    $total = 0;\n    foreach ($cart as $item) {\n        $total += $item["price"] * $item["qty"];\n    }\n    return $total;\n}\n\naddToCart($cart, "Apple", 1.5, 3);\naddToCart($cart, "Banana", 0.8, 5);\n\necho "Total: " . calculateTotal($cart) . " euros\\n";\nforeach ($cart as $item) {\n    echo $item["product"] . " x" . $item["qty"] . " = " . ($item["price"] * $item["qty"]) . " euros\\n";\n}\n?>`,
      exerciseAr: `<?php\n// أنشئ نظام سلة تسوق مصغر\n$cart = [];\n\nfunction addToCart(&$cart, $product, $price, $qty = 1) {\n    $cart[] = ["product" => $product, "price" => $price, "qty" => $qty];\n}\n\nfunction calculateTotal($cart) {\n    $total = 0;\n    foreach ($cart as $item) {\n        $total += $item["price"] * $item["qty"];\n    }\n    return $total;\n}\n\naddToCart($cart, "تفاحة", 1.5, 3);\necho "المجموع: " . calculateTotal($cart) . " يورو\\n";\n?>`,
    },
    15: {
      exerciseFr: `<?php\n// Connectez-vous à une base SQLite et créez une table utilisateurs\ntry {\n    $pdo = new PDO("sqlite::memory:");\n    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n\n    // Créer la table\n    $pdo->exec("CREATE TABLE IF NOT EXISTS users (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        nom TEXT NOT NULL,\n        email TEXT UNIQUE NOT NULL,\n        age INTEGER\n    )");\n\n    // Insérer des données\n    $pdo->exec("INSERT INTO users (nom, email, age) VALUES ('Alice', 'alice@mail.com', 25)");\n    $pdo->exec("INSERT INTO users (nom, email, age) VALUES ('Bob', 'bob@mail.com', 30)");\n\n    // Lire les données\n    $stmt = $pdo->query("SELECT * FROM users");\n    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {\n        echo $row["nom"] . " - " . $row["email"] . " - " . $row["age"] . " ans\\n";\n    }\n} catch (PDOException $e) {\n    echo "Erreur: " . $e->getMessage() . "\\n";\n}\n?>`,
      exerciseEn: `<?php\n// Connect to a SQLite database and create a users table\ntry {\n    $pdo = new PDO("sqlite::memory:");\n    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n\n    // Create the table\n    $pdo->exec("CREATE TABLE IF NOT EXISTS users (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        name TEXT NOT NULL,\n        email TEXT UNIQUE NOT NULL,\n        age INTEGER\n    )");\n\n    // Insert data\n    $pdo->exec("INSERT INTO users (name, email, age) VALUES ('Alice', 'alice@mail.com', 25)");\n    $pdo->exec("INSERT INTO users (name, email, age) VALUES ('Bob', 'bob@mail.com', 30)");\n\n    // Read data\n    $stmt = $pdo->query("SELECT * FROM users");\n    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {\n        echo $row["name"] . " - " . $row["email"] . " - " . $row["age"] . " years\\n";\n    }\n} catch (PDOException $e) {\n    echo "Error: " . $e->getMessage() . "\\n";\n}\n?>`,
      exerciseAr: `<?php\n// اتصل بقاعدة بيانات SQLite وأنشئ جدول المستخدمين\ntry {\n    $pdo = new PDO("sqlite::memory:");\n    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n\n    $pdo->exec("CREATE TABLE IF NOT EXISTS users (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        name TEXT NOT NULL,\n        email TEXT UNIQUE NOT NULL\n    )");\n\n    $pdo->exec("INSERT INTO users (name, email) VALUES ('Alice', 'alice@mail.com')");\n    echo "تم الاتصال بنجاح\\n";\n} catch (PDOException $e) {\n    echo "خطأ: " . $e->getMessage() . "\\n";\n}\n?>`,
    },
  },

  // ─── Python Lessons ───
  python: {
    1: {
      exerciseFr: `# Testez votre premier programme Python\nnom = "World"\nprint(f"Hello, {nom} !")\n\n# Calculez votre âge\nannee_naissance = 1990\nannee_actuelle = 2025\nage = annee_actuelle - annee_naissance\nprint(f"J'ai {age} ans")\n\n# Vérifiez le type des variables\nprint(type(nom))\nprint(type(age))`,
      exerciseEn: `# Test your first Python program\nname = "World"\nprint(f"Hello, {name}!")\n\n# Calculate your age\nbirth_year = 1990\ncurrent_year = 2025\nage = current_year - birth_year\nprint(f"I am {age} years old")\n\n# Check variable types\nprint(type(name))\nprint(type(age))`,
      exerciseAr: `# اختبر أول برنامج بايثون\nname = "العالم"\nprint(f"مرحباً، {name}!")\n\n# احسب عمرك\nbirth_year = 1990\nage = 2025 - birth_year\nprint(f"عمري {age} سنة")`,
    },
    2: {
      exerciseFr: `# Manipulez les variables et les types\nnom = "Alice"\nage = 25\ntaille = 1.68\nest_etudiant = True\n\nprint(f"Nom: {nom}, Type: {type(nom)}")\nprint(f"Age: {age}, Type: {type(age)}")\nprint(f"Taille: {taille}m, Type: {type(taille)}")\nprint(f"Etudiant: {est_etudiant}, Type: {type(est_etudiant)}")\n\n# Convertissez un type\nage_str = str(age)\nprint(f"Age en string: '{age_str}'")`,
      exerciseEn: `# Manipulate variables and types\nname = "Alice"\nage = 25\nheight = 1.68\nis_student = True\n\nprint(f"Name: {name}, Type: {type(name)}")\nprint(f"Age: {age}, Type: {type(age)}")\nprint(f"Height: {height}m, Type: {type(height)}")\nprint(f"Student: {is_student}, Type: {type(is_student)}")\n\n# Convert a type\nage_str = str(age)\nprint(f"Age as string: '{age_str}'")`,
      exerciseAr: `# التعامل مع المتغيرات والأنواع\nname = "أليس"\nage = 25\nprint(f"الاسم: {name}, النوع: {type(name)}")\nprint(f"العمر: {age}, النوع: {type(age)}")`,
    },
    3: {
      exerciseFr: `# Utilisez les conditions\nage = 17\n\nif age >= 18:\n    print("Majeur")\nelif age >= 16:\n    print("Bientot majeur")\nelse:\n    print("Mineur")\n\n# Verifiez si un nombre est pair ou impair\nnombre = 42\nif nombre % 2 == 0:\n    print(f"{nombre} est pair")\nelse:\n    print(f"{nombre} est impair")\n\n# Operateur ternaire\nstatut = "adulte" if age >= 18 else "mineur"\nprint(f"Statut: {statut}")`,
      exerciseEn: `# Use conditions\nage = 17\n\nif age >= 18:\n    print("Adult")\nelif age >= 16:\n    print("Almost adult")\nelse:\n    print("Minor")\n\n# Check if a number is even or odd\nnumber = 42\nif number % 2 == 0:\n    print(f"{number} is even")\nelse:\n    print(f"{number} is odd")\n\n# Ternary operator\nstatus = "adult" if age >= 18 else "minor"\nprint(f"Status: {status}")`,
      exerciseAr: `# استخدام الشروط\nage = 17\nif age >= 18:\n    print("بالغ")\nelse:\n    print("قاصر")\n\n# تحقق إذا كان العدد زوجياً\nnumber = 42\nif number % 2 == 0:\n    print(f"{number} زوجي")\nelse:\n    print(f"{number} فردي")`,
    },
    4: {
      exerciseFr: `# Utilisez les boucles\n# Boucle for\nfor i in range(5):\n    print(f"Iteration {i + 1}")\n\n# Boucle while\ncompteur = 0\nwhile compteur < 3:\n    print(f"Compteur: {compteur}")\n    compteur += 1\n\n# Parcourir une liste\nfruits = ["pomme", "banane", "cerise"]\nfor fruit in fruits:\n    print(fruit)\n\n# Table de multiplication\nn = 7\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")`,
      exerciseEn: `# Use loops\n# For loop\nfor i in range(5):\n    print(f"Iteration {i + 1}")\n\n# While loop\ncounter = 0\nwhile counter < 3:\n    print(f"Counter: {counter}")\n    counter += 1\n\n# Iterate over a list\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit)\n\n# Multiplication table\nn = 7\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")`,
      exerciseAr: `# استخدام الحلقات\n# حلقة for\nfor i in range(5):\n    print(f"تكرار {i + 1}")\n\n# حلقة while\ncounter = 0\nwhile counter < 3:\n    print(f"العداد: {counter}")\n    counter += 1`,
    },
    5: {
      exerciseFr: `# Manipulez les listes\nnotes = [15, 18, 12, 20, 14]\n\n# Ajoutez une note\nnotes.append(16)\nprint(f"Notes: {notes}")\n\n# Calculez la moyenne\nmoyenne = sum(notes) / len(notes)\nprint(f"Moyenne: {moyenne:.2f}")\n\n# Triez les notes\nnotes.sort()\nprint(f"Notes triees: {notes}")\n\n# Accedez aux elements\nprint(f"Meilleure note: {notes[-1]}")\nprint(f"Pire note: {notes[0]}")\n\n# Slicing\nprint(f"3 meilleures: {notes[-3:]}")`,
      exerciseEn: `# Manipulate lists\ngrades = [15, 18, 12, 20, 14]\n\n# Add a grade\ngrades.append(16)\nprint(f"Grades: {grades}")\n\n# Calculate average\naverage = sum(grades) / len(grades)\nprint(f"Average: {average:.2f}")\n\n# Sort grades\ngrades.sort()\nprint(f"Sorted grades: {grades}")\n\n# Access elements\nprint(f"Best grade: {grades[-1]}")\nprint(f"Worst grade: {grades[0]}")\n\n# Slicing\nprint(f"Top 3: {grades[-3:]}")`,
      exerciseAr: `# التعامل مع القوائم\ngrades = [15, 18, 12, 20, 14]\n\n# إضافة درجة\ngrades.append(16)\nprint(f"الدرجات: {grades}")\n\n# حساب المتوسط\naverage = sum(grades) / len(grades)\nprint(f"المتوسط: {average:.2f}")`,
    },
    6: {
      exerciseFr: `# Manipulez les dictionnaires\netudiant = {\n    "nom": "Alice",\n    "age": 22,\n    "notes": [15, 18, 12],\n    "ville": "Paris"\n}\n\n# Accedez aux valeurs\nprint(f"Nom: {etudiant['nom']}")\nprint(f"Age: {etudiant['age']}")\n\n# Ajoutez une clef\netudiant["email"] = "alice@mail.com"\n\n# Parcourez le dictionnaire\nfor cle, valeur in etudiant.items():\n    print(f"{cle}: {valeur}")\n\n# Calculez la moyenne des notes\nmoy = sum(etudiant["notes"]) / len(etudiant["notes"])\nprint(f"Moyenne: {moy:.2f}")`,
      exerciseEn: `# Manipulate dictionaries\nstudent = {\n    "name": "Alice",\n    "age": 22,\n    "grades": [15, 18, 12],\n    "city": "Paris"\n}\n\n# Access values\nprint(f"Name: {student['name']}")\nprint(f"Age: {student['age']}")\n\n# Add a key\nstudent["email"] = "alice@mail.com"\n\n# Iterate over the dictionary\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\n# Calculate average grades\navg = sum(student["grades"]) / len(student["grades"])\nprint(f"Average: {avg:.2f}")`,
      exerciseAr: `# التعامل مع القواميس\nstudent = {\n    "name": "أليس",\n    "age": 22,\n    "grades": [15, 18, 12],\n}\n\n# الوصول للقيم\nprint(f"الاسم: {student['name']}")\nprint(f"العمر: {student['age']}")`,
    },
    7: {
      exerciseFr: `# Créez et utilisez des fonctions\ndef saluer(nom):\n    return f"Bonjour, {nom} !"\n\ndef calculer_imc(poids, taille_cm):\n    taille_m = taille_cm / 100\n    return poids / (taille_m ** 2)\n\ndef est_pair(n):\n    return n % 2 == 0\n\n# Testez les fonctions\nprint(saluer("Alice"))\nimc = calculer_imc(70, 175)\nprint(f"IMC: {imc:.2f}")\nprint(f"42 est pair? {est_pair(42)}")\nprint(f"7 est pair? {est_pair(7)}")`,
      exerciseEn: `# Create and use functions\ndef greet(name):\n    return f"Hello, {name}!"\n\ndef calculate_bmi(weight, height_cm):\n    height_m = height_cm / 100\n    return weight / (height_m ** 2)\n\ndef is_even(n):\n    return n % 2 == 0\n\n# Test the functions\nprint(greet("Alice"))\nbmi = calculate_bmi(70, 175)\nprint(f"BMI: {bmi:.2f}")\nprint(f"Is 42 even? {is_even(42)}")\nprint(f"Is 7 even? {is_even(7)}")`,
      exerciseAr: `# إنشاء واستخدام الدوال\ndef greet(name):\n    return f"مرحباً، {name}!"\n\ndef is_even(n):\n    return n % 2 == 0\n\n# اختبار الدوال\nprint(greet("أليس"))\nprint(f"هل 42 زوجي؟ {is_even(42)}")\nprint(f"هل 7 زوجي؟ {is_even(7)}")`,
    },
    8: {
      exerciseFr: `# Manipulez les fichiers\nimport json\n\n# Ecrivez un fichier\ndonnees = {"nom": "Alice", "age": 25, "ville": "Paris"}\nwith open("data.json", "w") as f:\n    json.dump(donnees, f, indent=2)\nprint("Fichier cree!")\n\n# Lisez le fichier\nwith open("data.json", "r") as f:\n    contenu = json.load(f)\nprint(f"Nom: {contenu['nom']}")\nprint(f"Age: {contenu['age']}")\n\n# Gestion d'exception\ntry:\n    with open("inexistant.txt", "r") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("Fichier non trouve!")`,
      exerciseEn: `# Manipulate files\nimport json\n\n# Write a file\ndata = {"name": "Alice", "age": 25, "city": "Paris"}\nwith open("data.json", "w") as f:\n    json.dump(data, f, indent=2)\nprint("File created!")\n\n# Read the file\nwith open("data.json", "r") as f:\n    content = json.load(f)\nprint(f"Name: {content['name']}")\nprint(f"Age: {content['age']}")\n\n# Exception handling\ntry:\n    with open("nonexistent.txt", "r") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("File not found!")`,
      exerciseAr: `# التعامل مع الملفات\nimport json\n\n# كتابة ملف\ndata = {"name": "أليس", "age": 25}\nwith open("data.json", "w") as f:\n    json.dump(data, f, indent=2)\nprint("تم إنشاء الملف!")\n\n# التعامل مع الاستثناءات\ntry:\n    with open("غير_موجود.txt", "r") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("الملف غير موجود!")`,
    },
    9: {
      exerciseFr: `# Programmation Orientee Objet en Python\nclass Animal:\n    def __init__(self, nom, age):\n        self.nom = nom\n        self.age = age\n\n    def presenter(self):\n        return f"Je suis {self.nom}, j'ai {self.age} ans"\n\nclass Chien(Animal):\n    def aboyer(self):\n        return "Wouf! Wouf!"\n\nclass Chat(Animal):\n    def miauler(self):\n        return "Miaou!"\n\n# Testez les objets\nchien = Chien("Rex", 5)\nprint(chien.presenter())\nprint(chien.aboyer())\n\nchat = Chat("Minou", 3)\nprint(chat.presenter())\nprint(chat.miauler())`,
      exerciseEn: `# Object-Oriented Programming in Python\nclass Animal:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def introduce(self):\n        return f"I am {self.name}, {self.age} years old"\n\nclass Dog(Animal):\n    def bark(self):\n        return "Woof! Woof!"\n\nclass Cat(Animal):\n    def meow(self):\n        return "Meow!"\n\n# Test the objects\ndog = Dog("Rex", 5)\nprint(dog.introduce())\nprint(dog.bark())\n\ncat = Cat("Whiskers", 3)\nprint(cat.introduce())\nprint(cat.meow())`,
      exerciseAr: `# البرمجة كائنية التوجه في بايثون\nclass Animal:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def introduce(self):\n        return f"أنا {self.name}, عمري {self.age} سنة"\n\nclass Dog(Animal):\n    def bark(self):\n        return "هوو! هوو!"\n\nrex = Dog("ريكس", 5)\nprint(rex.introduce())\nprint(rex.bark())`,
    },
    10: {
      exerciseFr: `# Utilisez les modules import math\nimport math\nimport random\nimport datetime\n\n# Mathematiques\nprint(f"Pi = {math.pi}")\nprint(f"Racine de 144 = {math.sqrt(144)}")\nprint(f"Factorielle de 5 = {math.factorial(5)}")\n\n# Nombres aleatoires\nprint(f"Nombre aleatoire: {random.randint(1, 100)}")\nprint(f"Choix aleatoire: {random.choice(['a', 'b', 'c'])}")\n\n# Date et heure\nmaintenant = datetime.datetime.now()\nprint(f"Date: {maintenant.strftime('%d/%m/%Y %H:%M')}")`,
      exerciseEn: `# Use modules\nimport math\nimport random\nimport datetime\n\n# Math\nprint(f"Pi = {math.pi}")\nprint(f"Square root of 144 = {math.sqrt(144)}")\nprint(f"Factorial of 5 = {math.factorial(5)}")\n\n# Random numbers\nprint(f"Random number: {random.randint(1, 100)}")\nprint(f"Random choice: {random.choice(['a', 'b', 'c'])}")\n\n# Date and time\nnow = datetime.datetime.now()\nprint(f"Date: {now.strftime('%d/%m/%Y %H:%M')}")`,
      exerciseAr: `# استخدام الوحدات\nimport math\nimport random\nimport datetime\n\nprint(f"Pi = {math.pi}")\nprint(f"الجذر التربيعي لـ 144 = {math.sqrt(144)}")\n\nnow = datetime.datetime.now()\nprint(f"التاريخ: {now.strftime('%d/%m/%Y %H:%M')}")`,
    },
  },

  // ─── n8n Lessons ───
  n8n: {
    1: {
      exerciseFr: `// n8n : Créez votre premier noeud Manual Trigger\n// 1. Ajoutez un noeud "Manual Trigger"\n// 2. Ajoutez un noeud "Set" pour definir des donnees\n// 3. Configurez les champs suivants :\n//    - nom: "Alice"\n//    - age: 25\n//    - ville: "Paris"\n// 4. Connectez les noeuds et executez le workflow\n\n// JSON de sortie attendu :\n// { "nom": "Alice", "age": 25, "ville": "Paris" }`,
      exerciseEn: `// n8n: Create your first Manual Trigger node\n// 1. Add a "Manual Trigger" node\n// 2. Add a "Set" node to define data\n// 3. Configure the following fields:\n//    - name: "Alice"\n//    - age: 25\n//    - city: "Paris"\n// 4. Connect the nodes and execute the workflow\n\n// Expected output JSON:\n// { "name": "Alice", "age": 25, "city": "Paris" }`,
      exerciseAr: `// n8n: أنشئ أول عقدة Manual Trigger\n// 1. أضف عقدة "Manual Trigger"\n// 2. أضف عقدة "Set" لتحديد البيانات\n// 3. قم بتوصيل العقد وتنفيذ سير العمل`,
    },
    2: {
      exerciseFr: `// n8n : Installation et Configuration\n// Verifiez votre installation n8n :\n\n// Commande pour demarrer n8n localement :\n// npx n8n start\n\n// Variables d'environnement a configurer :\n// - N8N_PORT=5678\n// - N8N_PROTOCOL=http\n// - GENERIC_TIMEZONE=Europe/Paris\n\n// Testez l'acces a l'interface : http://localhost:5678`,
      exerciseEn: `// n8n: Installation and Configuration\n// Check your n8n installation:\n\n// Command to start n8n locally:\n// npx n8n start\n\n// Environment variables to configure:\n// - N8N_PORT=5678\n// - N8N_PROTOCOL=http\n// - GENERIC_TIMEZONE=Europe/Paris\n\n// Test interface access: http://localhost:5678`,
      exerciseAr: `// n8n: التثبيت والإعداد\n// تحقق من تثبيت n8n:\n// npx n8n start\n// اختبر الوصول: http://localhost:5678`,
    },
    3: {
      exerciseFr: `// n8n : Premier Workflow\n// Creez un workflow qui :\n// 1. Demarre avec un "Manual Trigger"\n// 2. Utilise un noeud "Date & Time" pour obtenir la date actuelle\n// 3. Utilise un noeud "Set" pour creer un message\n//    - message: "Bonjour! Nous sommes le {date_actuelle}"\n// 4. Affiche le resultat dans la console\n\n// Astuce : Utilisez l'expression $json pour acceder aux donnees`,
      exerciseEn: `// n8n: First Workflow\n// Create a workflow that:\n// 1. Starts with a "Manual Trigger"\n// 2. Uses a "Date & Time" node to get the current date\n// 3. Uses a "Set" node to create a message\n//    - message: "Hello! Today is {current_date}"\n// 4. Displays the result in the console\n\n// Tip: Use $json expression to access data`,
      exerciseAr: `// n8n: سير العمل الأول\n// أنشئ سير عمل يبدأ بـ Manual Trigger ويستخدم Date & Time وSet لعرض رسالة`,
    },
    4: {
      exerciseFr: `// n8n : Webhooks et Triggers\n// Configurez un Webhook qui :\n// 1. Ajoutez un noeud "Webhook" (POST)\n// 2. Recupere les donnees JSON envoyees :\n//    - nom, email, message\n// 3. Utilise un noeud "Respond to Webhook" pour repondre :\n//    - statut: "Recu avec succes"\n//    - data: les donnees recues\n\n// Test avec curl :\n// curl -X POST http://localhost:5678/webhook/test \\\n//   -H "Content-Type: application/json" \\\n//   -d '{"nom":"Alice","email":"alice@mail.com","message":"Bonjour!"}'`,
      exerciseEn: `// n8n: Webhooks and Triggers\n// Configure a Webhook that:\n// 1. Add a "Webhook" node (POST)\n// 2. Receives JSON data sent:\n//    - name, email, message\n// 3. Uses a "Respond to Webhook" node to reply:\n//    - status: "Received successfully"\n//    - data: the received data\n\n// Test with curl:\n// curl -X POST http://localhost:5678/webhook/test \\\n//   -H "Content-Type: application/json" \\\n//   -d '{"name":"Alice","email":"alice@mail.com","message":"Hello!"}'`,
      exerciseAr: `// n8n: Webhooks و Triggers\n// قم بتكوين Webhook يستقبل بيانات JSON ويرد عليها\n\n// Test with curl:\n// curl -X POST http://localhost:5678/webhook/test -H "Content-Type: application/json" -d '{"name":"Alice","message":"Hello!"}'`,
    },
    5: {
      exerciseFr: `// n8n : API et HTTP Request\n// Creez un workflow qui appelle une API externe :\n// 1. Ajoutez un noeud "HTTP Request"\n// 2. Configurez l'appel :\n//    - Method: GET\n//    - URL: https://jsonplaceholder.typicode.com/users/1\n// 3. Ajoutez un noeud "Set" pour extraire :\n//    - nom: $json.name\n//    - email: $json.email\n//    - ville: $json.address.city\n// 4. Affichez les informations de l'utilisateur`,
      exerciseEn: `// n8n: API and HTTP Request\n// Create a workflow that calls an external API:\n// 1. Add an "HTTP Request" node\n// 2. Configure the call:\n//    - Method: GET\n//    - URL: https://jsonplaceholder.typicode.com/users/1\n// 3. Add a "Set" node to extract:\n//    - name: $json.name\n//    - email: $json.email\n//    - city: $json.address.city\n// 4. Display the user information`,
      exerciseAr: `// n8n: API و HTTP Request\n// أنشئ سير عمل يستدعي API خارجي\n// URL: https://jsonplaceholder.typicode.com/users/1`,
    },
    6: {
      exerciseFr: `// n8n : Code Node (JavaScript)\n// Utilisez un noeud Code pour transformer des donnees :\n\n// Entree : un tableau d'utilisateurs\n// [\n//   { "nom": "Alice", "age": 25 },\n//   { "nom": "Bob", "age": 30 },\n//   { "nom": "Charlie", "age": 17 }\n// ]\n\n// Dans le Code Node :\nconst utilisateurs = $input.all();\nconst majeurs = utilisateurs\n  .filter(u => u.json.age >= 18)\n  .map(u => ({ json: { ...u.json, statut: "majeur" } }));\n\nreturn majeurs;`,
      exerciseEn: `// n8n: Code Node (JavaScript)\n// Use a Code node to transform data:\n\n// Input: an array of users\n// [\n//   { "name": "Alice", "age": 25 },\n//   { "name": "Bob", "age": 30 },\n//   { "name": "Charlie", "age": 17 }\n// ]\n\n// In the Code Node:\nconst users = $input.all();\nconst adults = users\n  .filter(u => u.json.age >= 18)\n  .map(u => ({ json: { ...u.json, status: "adult" } }));\n\nreturn adults;`,
      exerciseAr: `// n8n: Code Node (JavaScript)\n// استخدم عقدة Code لتحويل البيانات\n\nconst users = $input.all();\nconst adults = users.filter(u => u.json.age >= 18);\nreturn adults;`,
    },
    7: {
      exerciseFr: `// n8n : Conditions et IF\n// Creez un workflow avec des conditions :\n// 1. Manual Trigger avec un champ "age"\n// 2. Noeud "IF" pour verifier :\n//    - Condition: age >= 18\n//    - True: Set -> statut: "Majeur"\n//    - False: Set -> statut: "Mineur"\n// 3. Les deux branches convergent vers un noeud final\n// 4. Testez avec differentes valeurs d'age`,
      exerciseEn: `// n8n: Conditions and IF\n// Create a workflow with conditions:\n// 1. Manual Trigger with an "age" field\n// 2. "IF" node to check:\n//    - Condition: age >= 18\n//    - True: Set -> status: "Adult"\n//    - False: Set -> status: "Minor"\n// 3. Both branches converge to a final node\n// 4. Test with different age values`,
      exerciseAr: `// n8n: الشروط و IF\n// أنشئ سير عمل مع شروط\n// تحقق: العمر >= 18 → بالغ، وإلا → قاصر`,
    },
    8: {
      exerciseFr: `// n8n : Integrations populaires\n// Creez un workflow qui integre des services :\n// 1. Webhook qui declenche l'envoi d'un email\n// 2. Noeud "Email" (ou Gmail) :\n//    - A: dest@mail.com\n//    - Sujet: "Nouvelle inscription"\n//    - Corps: "Un nouvel utilisateur s'est inscrit"\n// 3. Ajoutez un noeud "Google Sheets" pour enregistrer :\n//    - Feuille: "Inscriptions"\n//    - Ligne: nom, email, date\n\n// Alternative: Utilisez Slack/Discord pour les notifications`,
      exerciseEn: `// n8n: Popular Integrations\n// Create a workflow that integrates services:\n// 1. Webhook that triggers sending an email\n// 2. "Email" node (or Gmail):\n//    - To: dest@mail.com\n//    - Subject: "New registration"\n//    - Body: "A new user has registered"\n// 3. Add a "Google Sheets" node to save:\n//    - Sheet: "Registrations"\n//    - Row: name, email, date\n\n// Alternative: Use Slack/Discord for notifications`,
      exerciseAr: `// n8n: عمليات التكامل الشائعة\n// أنشئ سير عمل يرسل بريد إلكتروني ويحفظ في Google Sheets`,
    },
    9: {
      exerciseFr: `// n8n : Variables et Environnement\n// Utilise des variables dans un workflow :\n// 1. Noeud "Set" pour definir des variables globales :\n//    - api_url: "https://api.example.com"\n//    - api_key: "ma-cle-secrete"\n// 2. Noeud "HTTP Request" qui utilise les variables :\n//    - URL: {{ $json.api_url }}/users\n//    - Header: Authorization: Bearer {{ $json.api_key }}\n// 3. Utilisez des expressions $env() pour les variables d'environnement`,
      exerciseEn: `// n8n: Variables and Environment\n// Use variables in a workflow:\n// 1. "Set" node to define global variables:\n//    - api_url: "https://api.example.com"\n//    - api_key: "my-secret-key"\n// 2. "HTTP Request" node that uses variables:\n//    - URL: {{ $json.api_url }}/users\n//    - Header: Authorization: Bearer {{ $json.api_key }}\n// 3. Use $env() expressions for environment variables`,
      exerciseAr: `// n8n: المتغيرات والبيئة\n// استخدم المتغيرات في سير العمل\n// URL: {{ $json.api_url }}/users`,
    },
    10: {
      exerciseFr: `// n8n : Projet - Workflow complet\n// Creez un workflow complet de gestion de contacts :\n// 1. Webhook POST recoit un contact (nom, email, telephone)\n// 2. Code Node valide les donnees :\n//    - Verifie que l'email contient "@"\n//    - Verifie que le telephone a 10 chiffres\n// 3. IF : si valide → enregistre dans Google Sheets\n//         si invalide → renvoie une erreur au webhook\n// 4. Envoie un email de confirmation\n// 5. Notifie sur Slack\n// 6. Repond au webhook avec le statut`,
      exerciseEn: `// n8n: Project - Complete Workflow\n// Create a complete contact management workflow:\n// 1. POST Webhook receives a contact (name, email, phone)\n// 2. Code Node validates the data:\n//    - Check that email contains "@ "\n//    - Check that phone has 10 digits\n// 3. IF: valid → save to Google Sheets\n//         invalid → return error to webhook\n// 4. Sends a confirmation email\n// 5. Notifies on Slack\n// 6. Responds to webhook with status`,
      exerciseAr: `// n8n: مشروع - سير عمل كامل\n// أنشئ سير عمل كامل لإدارة جهات الاتصال\n// يتلقى بيانات الاتصال → يتحقق → يحفظ → يرسل تأكيد`,
    },
  },

  // ─── OpenClaw Lessons ───
  openclaw: {
    1: {
      exerciseFr: `// OpenClaw : Verifiez votre installation\n// Commande pour tester OpenClaw :\n\nopenclaw --version\n\n// Créez votre premier script :\nopenclaw init mon-projet\ncd mon-projet\n\n// Ouvrez le fichier de configuration et verifiez :\n// - version du moteur\n// - plugins actifs\n// - chemins de configuration\n\n// Executez le script de test :\nopenclaw run test`,
      exerciseEn: `// OpenClaw: Check your installation\n// Command to test OpenClaw:\n\nopenclaw --version\n\n// Create your first script:\nopenclaw init my-project\ncd my-project\n\n// Open the configuration file and check:\n// - engine version\n// - active plugins\n// - configuration paths\n\n// Run the test script:\nopenclaw run test`,
      exerciseAr: `// OpenClaw: تحقق من التثبيت\nopenclaw --version\nopenclaw init my-project\nopenclaw run test`,
    },
    2: {
      exerciseFr: `// OpenClaw : Configuration de l'environnement\n// Configurez le fichier openclaw.config.json :\n\n// {\n//   "engine": "v2",\n//   "plugins": ["web", "api", "ai"],\n//   "paths": {\n//     "scripts": "./scripts",\n//     "output": "./output"\n//   },\n//   "ai": {\n//     "provider": "openai",\n//     "model": "gpt-4"\n//   }\n// }\n\n// Testez la configuration :\nopenclaw config:validate`,
      exerciseEn: `// OpenClaw: Environment Configuration\n// Configure the openclaw.config.json file:\n\n// {\n//   "engine": "v2",\n//   "plugins": ["web", "api", "ai"],\n//   "paths": {\n//     "scripts": "./scripts",\n//     "output": "./output"\n//   },\n//   "ai": {\n//     "provider": "openai",\n//     "model": "gpt-4"\n//   }\n// }\n\n// Validate the configuration:\nopenclaw config:validate`,
      exerciseAr: `// OpenClaw: إعداد البيئة\n// تكوين ملف openclaw.config.json\nopenclaw config:validate`,
    },
    3: {
      exerciseFr: `// OpenClaw : Premiers pas\n// Creez un script simple dans scripts/hello.oc :\n\n// script "hello" {\n//   action: print("Bonjour le monde !")\n//   action: print("OpenClaw est pret !")\n// }\n\n// Executez le script :\nopenclaw run hello\n\n// Essayez un script avec des variables :\n// script "saluer" {\n//   vars: { nom: "Alice" }\n//   action: print("Bonjour, " + vars.nom)\n// }`,
      exerciseEn: `// OpenClaw: Getting Started\n// Create a simple script in scripts/hello.oc:\n\n// script "hello" {\n//   action: print("Hello World!")\n//   action: print("OpenClaw is ready!")\n// }\n\n// Run the script:\nopenclaw run hello\n\n// Try a script with variables:\n// script "greet" {\n//   vars: { name: "Alice" }\n//   action: print("Hello, " + vars.name)\n// }`,
      exerciseAr: `// OpenClaw: البداية\n// أنشئ سكريبت بسيط\n// openclaw run hello`,
    },
    4: {
      exerciseFr: `// OpenClaw : Scripting avance\n// Creez un script qui utilise des conditions et des boucles :\n\n// script "analyse" {\n//   vars: { nombre: 42 }\n//   \n//   if (vars.nombre % 2 == 0) {\n//     action: print(vars.nombre + " est pair")\n//   } else {\n//     action: print(vars.nombre + " est impair")\n//   }\n//   \n//   // Boucle\n//   for i in range(1, 6) {\n//     action: print("Iteration " + i)\n//   }\n// }`,
      exerciseEn: `// OpenClaw: Advanced Scripting\n// Create a script that uses conditions and loops:\n\n// script "analysis" {\n//   vars: { number: 42 }\n//   \n//   if (vars.number % 2 == 0) {\n//     action: print(vars.number + " is even")\n//   } else {\n//     action: print(vars.number + " is odd")\n//   }\n//   \n//   // Loop\n//   for i in range(1, 6) {\n//     action: print("Iteration " + i)\n//   }\n// }`,
      exerciseAr: `// OpenClaw: Scripting متقدم\n// أنشئ سكريبت بالشروط والحلقات`,
    },
    5: {
      exerciseFr: `// OpenClaw : Acces au systeme\n// Creez un script qui interagit avec le systeme :\n\n// script "system-info" {\n//   action: sys.exec("uname -a")\n//   action: sys.exec("pwd")\n//   action: sys.exec("ls -la")\n//   \n//   // Lire un fichier\n//   action: file.read("./config.json")\n//   \n//   // Ecrire un fichier\n//   action: file.write("./output.txt", "Resultat du script")\n// }`,
      exerciseEn: `// OpenClaw: System Access\n// Create a script that interacts with the system:\n\n// script "system-info" {\n//   action: sys.exec("uname -a")\n//   action: sys.exec("pwd")\n//   action: sys.exec("ls -la")\n//   \n//   // Read a file\n//   action: file.read("./config.json")\n//   \n//   // Write a file\n//   action: file.write("./output.txt", "Script result")\n// }`,
      exerciseAr: `// OpenClaw: الوصول للنظام\n// سكريبت يتفاعل مع النظام\n// sys.exec("ls -la")\n// file.read / file.write`,
    },
    6: {
      exerciseFr: `// OpenClaw : Plugins et Extensions\n// Installez et utilisez un plugin :\n\n// Installation :\nopenclaw plugin:install @openclaw/web-scraper\nopenclaw plugin:install @openclaw/ai-assistant\n\n// Utilisation dans un script :\n// script "web-research" {\n//   plugins: ["web-scraper", "ai-assistant"]\n//   \n//   action: web.scraper.fetch("https://example.com")\n//   action: ai.assist("Resume cette page")\n// }`,
      exerciseEn: `// OpenClaw: Plugins and Extensions\n// Install and use a plugin:\n\n// Installation:\nopenclaw plugin:install @openclaw/web-scraper\nopenclaw plugin:install @openclaw/ai-assistant\n\n// Usage in a script:\n// script "web-research" {\n//   plugins: ["web-scraper", "ai-assistant"]\n//   \n//   action: web.scraper.fetch("https://example.com")\n//   action: ai.assist("Summarize this page")\n// }`,
      exerciseAr: `// OpenClaw: الإضافات\n// تثبيت واستخدام الإضافات\nopenclaw plugin:install @openclaw/web-scraper`,
    },
    7: {
      exerciseFr: `// OpenClaw : Agents IA Multi-modeles\n// Configurez plusieurs agents IA :\n\n// script "multi-ai" {\n//   agents: {\n//     gpt: { provider: "openai", model: "gpt-4" }\n//     claude: { provider: "anthropic", model: "claude-3" }\n//     llama: { provider: "ollama", model: "llama3" }\n//   }\n//   \n//   action: agents.gpt.ask("Explique ce concept")\n//   action: agents.claude.ask("Resume ce texte")\n//   action: agents.llama.ask("Traduis en arabe")\n// }`,
      exerciseEn: `// OpenClaw: Multi-model AI Agents\n// Configure multiple AI agents:\n\n// script "multi-ai" {\n//   agents: {\n//     gpt: { provider: "openai", model: "gpt-4" }\n//     claude: { provider: "anthropic", model: "claude-3" }\n//     llama: { provider: "ollama", model: "llama3" }\n//   }\n//   \n//   action: agents.gpt.ask("Explain this concept")\n//   action: agents.claude.ask("Summarize this text")\n//   action: agents.llama.ask("Translate to Arabic")\n// }`,
      exerciseAr: `// OpenClaw: وكلاء ذكاء اصطناعي متعدد النماذج\n// تكوين عدة وكلاء ذكاء اصطناعي`,
    },
    8: {
      exerciseFr: `// OpenClaw : Projet - Assistant personnel\n// Creez un assistant personnel complet :\n\n// script "assistant" {\n//   agents: { ia: { provider: "openai", model: "gpt-4" } }\n//   plugins: ["web-scraper", "calendar", "email"]\n//   \n//   // Recupere la meteo\n//   action: web.scraper.fetch("https://wttr.in/Paris")\n//   \n//   // Verifie le calendrier\n//   action: calendar.getEvents(today)\n//   \n//   // Resumé IA\n//   action: ia.assist("Donne-moi un resume de ma journee")\n//   \n//   // Envoie un email recap\n//   action: email.send({\n//     to: "moi@mail.com",\n//     subject: "Resume du jour",\n//     body: "Voici votre resume..."\n//   })\n// }`,
      exerciseEn: `// OpenClaw: Project - Personal Assistant\n// Create a complete personal assistant:\n\n// script "assistant" {\n//   agents: { ai: { provider: "openai", model: "gpt-4" } }\n//   plugins: ["web-scraper", "calendar", "email"]\n//   \n//   // Fetch weather\n//   action: web.scraper.fetch("https://wttr.in/Paris")\n//   \n//   // Check calendar\n//   action: calendar.getEvents(today)\n//   \n//   // AI summary\n//   action: ai.assist("Give me a summary of my day")\n//   \n//   // Send recap email\n//   action: email.send({\n//     to: "me@mail.com",\n//     subject: "Daily Summary",\n//     body: "Here is your summary..."\n//   })\n// }`,
      exerciseAr: `// OpenClaw: مشروع - مساعد شخصي\n// أنشئ مساعد شخصي كامل\n// يجلب الطقس ويتحقق من التقويم ويرسل ملخص`,
    },
    9: {
      exerciseFr: `// OpenClaw : Bonnes pratiques et Securite\n// Appliquez les bonnes pratiques :\n\n// 1. Ne jamais stocker de cles API en clair\n// Utilisez les variables d'environnement :\n// export OPENCLAW_API_KEY="sk-xxx"\n\n// 2. Valider les entrees utilisateur :\n// script "safe-input" {\n//   vars: { user_input: "..." }\n//   if (validate.isSafe(vars.user_input)) {\n//     action: print("Entree valide")\n//   }\n// }\n\n// 3. Logger les erreurs :\n// script "with-error-handling" {\n//   try {\n//     action: riskyOperation()\n//   } catch (error) {\n//     action: log.error(error.message)\n//   }\n// }`,
      exerciseEn: `// OpenClaw: Best Practices and Security\n// Apply best practices:\n\n// 1. Never store API keys in plain text\n// Use environment variables:\n// export OPENCLAW_API_KEY="sk-xxx"\n\n// 2. Validate user input:\n// script "safe-input" {\n//   vars: { user_input: "..." }\n//   if (validate.isSafe(vars.user_input)) {\n//     action: print("Valid input")\n//   }\n// }\n\n// 3. Log errors:\n// script "with-error-handling" {\n//   try {\n//     action: riskyOperation()\n//   } catch (error) {\n//     action: log.error(error.message)\n//   }\n// }`,
      exerciseAr: `// OpenClaw: أفضل الأمان والممارسات\n// لا تخزن مفاتيح API كنص عادي\n// تحقق من المدخلات\n// سجل الأخطاء`,
    },
    10: {
      exerciseFr: `// OpenClaw : Projet final - Automation complete\n// Creez un workflow d'automation complet :\n\n// script "full-automation" {\n//   agents: { ia: { provider: "openai", model: "gpt-4" } }\n//   plugins: ["web-scraper", "email", "slack", "sheets"]\n//   triggers: { schedule: "0 9 * * *" }\n//   \n//   // 1. Recuperer les actualites\n//   action: web.scraper.fetch("https://news.example.com")\n//   \n//   // 2. Resumer avec IA\n//   set actualites = ia.assist("Resume les actualites du jour")\n//   \n//   // 3. Envoyer par email\n//   action: email.send({ to: "team@company.com", subject: "News", body: actualites })\n//   \n//   // 4. Notifier sur Slack\n//   action: slack.postMessage({ channel: "#general", text: actualites })\n//   \n//   // 5. Archiver dans Google Sheets\n//   action: sheets.appendRow({ date: today(), resume: actualites })\n// }`,
      exerciseEn: `// OpenClaw: Final Project - Complete Automation\n// Create a complete automation workflow:\n\n// script "full-automation" {\n//   agents: { ai: { provider: "openai", model: "gpt-4" } }\n//   plugins: ["web-scraper", "email", "slack", "sheets"]\n//   triggers: { schedule: "0 9 * * *" }\n//   \n//   // 1. Fetch news\n//   action: web.scraper.fetch("https://news.example.com")\n//   \n//   // 2. Summarize with AI\n//   set news = ai.assist("Summarize today's news")\n//   \n//   // 3. Send by email\n//   action: email.send({ to: "team@company.com", subject: "News", body: news })\n//   \n//   // 4. Notify on Slack\n//   action: slack.postMessage({ channel: "#general", text: news })\n//   \n//   // 5. Archive in Google Sheets\n//   action: sheets.appendRow({ date: today(), summary: news })\n// }`,
      exerciseAr: `// OpenClaw: المشروع النهائي - أتمتة كاملة\n// أنشئ سير عمل أتمتة متكامل\n// يجلب الأخبار → يلخصها بالذكاء الاصطناعي → يرسل بالبريد → يُخطِر على Slack`,
    },
  },
};

async function main() {
  console.log('🚀 Adding exercises to lessons...\n');

  let updated = 0;

  for (const [courseSlug, lessonExercises] of Object.entries(exercises)) {
    for (const [order, exercise] of Object.entries(lessonExercises)) {
      const lessonOrder = parseInt(order, 10);

      const lesson = await prisma.lesson.findFirst({
        where: {
          course: { slug: courseSlug },
          order: lessonOrder,
        },
      });

      if (!lesson) {
        console.log(`⚠️  Lesson #${lessonOrder} not found in ${courseSlug}`);
        continue;
      }

      if (lesson.exerciseFr) {
        console.log(`✅ Lesson #${lessonOrder} in ${courseSlug} already has an exercise - skipping`);
        continue;
      }

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          exerciseFr: exercise.exerciseFr,
          exerciseEn: exercise.exerciseEn,
          exerciseAr: exercise.exerciseAr,
        },
      });

      console.log(`✅ Added exercise to "${lesson.titleFr}" (${courseSlug} #${lessonOrder})`);
      updated++;
    }
  }

  console.log(`\n🎉 Done! Updated ${updated} lessons with exercises.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
