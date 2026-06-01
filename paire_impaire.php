<?php
declare(strict_types=1);

$input = '';
$result = null;
$error = null;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $input = trim((string)($_POST['nombre'] ?? ''));

    if ($input === '') {
        $error = "Veuillez saisir un nombre.";
    } elseif (!preg_match('/^-?\d+$/', $input)) {
        $error = "Saisissez un entier valide (ex: 7, -4).";
    } else {
        $n = (int)$input;
        $isEven = ($n % 2) === 0;
        $result = $isEven
            ? "Le nombre <strong>{$n}</strong> est <strong>pair</strong>."
            : "Le nombre <strong>{$n}</strong> est <strong>impair</strong>.";
    }
}
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vérifier Pair / Impair</title>
</head>
<body>
    <main>
        <h1>Vérifier si un nombre est pair ou impair</h1>
        <p>Saisissez un entier, puis cliquez sur "Vérifier".</p>

        <form method="post" action="">
            <label>
                Nombre
                <input
                    name="nombre"
                    type="number"
                    step="1"
                    inputmode="numeric"
                    placeholder="Ex: 12"
                    value="<?= htmlspecialchars($input, ENT_QUOTES, 'UTF-8') ?>"
                    required
                >
            </label>
            <button type="submit">Vérifier</button>
        </form>

        <?php if ($error !== null): ?>
            <p role="alert"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
        <?php elseif ($result !== null): ?>
            <p><?= $result ?></p>
        <?php endif; ?>
    </main>
</body>
</html>
