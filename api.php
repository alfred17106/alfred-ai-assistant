<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit(json_encode(['error' => 'Method not allowed'])); }
$CLAUDE_API_KEY = 'VOTRE_CLE_API_ICI';
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = isset($input['message']) ? trim($input['message']) : '';
$history = isset($input['history']) ? $input['history'] : [];
if (empty($userMessage)) { exit(json_encode(['error' => 'Message vide'])); }
$systemPrompt = "Tu es Alfred AI, assistant personnel de Ekolle Alfred Mbondo Celeste, informaticien developpeur web et enseignant base a Bruxelles. Reponds aux visiteurs de eamc.fr professionnellement et concisement. Email: alfred@eamc.fr Tel: +32 465 14 32 90 Portfolio: eamc.fr LinkedIn: linkedin.com/in/alfred-ekolle GitHub: github.com/alfred17106. Formation: Bachelier Informatique ESA Namur 2024-present, Licence Informatique Universite Douala 2021-2024. Experience: 7 ans enseignement informatique Cameroun, Tuteur ULB Schola Bruxelles, Responsable IT Boulangeries Delvaux Namur. Services: Dev Web WordPress WooCommerce PHP, Automatisation IA n8n Flowise Claude API, Cours Tutorat informatique. Projets: 4 agents IA eamc.fr, site delvauxboulangerie.com, github.com/alfred17106. Reponds en francais sauf si anglais. Max 3-4 phrases. Pour contact donne alfred@eamc.fr.";
$messages = [];
foreach ($history as $msg) {
    $messages[] = ['role' => ($msg['role'] === 'model' ? 'assistant' : $msg['role']), 'content' => $msg['content']];
}
$messages[] = ['role' => 'user', 'content' => $userMessage];
$payload = ['model' => 'claude-haiku-4-5-20251001', 'max_tokens' => 300, 'system' => $systemPrompt, 'messages' => $messages];
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'x-api-key: ' . $CLAUDE_API_KEY, 'anthropic-version: 2023-06-01']);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($response === false) { exit(json_encode(['error' => 'Erreur de connexion'])); }
$data = json_decode($response, true);
if ($httpCode !== 200) { exit(json_encode(['error' => 'Erreur API', 'details' => $data])); }
$reply = $data['content'][0]['text'] ?? 'Je suis desole, je ne peux pas repondre pour le moment.';
echo json_encode(['reply' => $reply, 'status' => 'success']);
?>
