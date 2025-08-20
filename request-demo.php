<?php
// request-demo.php
declare(strict_types=1);

// --- CONFIG ---
$TO_EMAIL = 'you@example.com'; // TODO: set your address
$FROM_EMAIL = 'no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'yourdomain.com');
$SUBJECT_PREFIX = 'Cittanuvola Demo Request';
date_default_timezone_set('Africa/Lagos');

// --- HELPERS ---
function clean(string $v, int $maxLen = 500): string {
  $v = trim($v);
  $v = preg_replace('/[\r\n]+/', ' ', $v); // header injection guard
  $v = strip_tags($v);
  if (mb_strlen($v) > $maxLen) $v = mb_substr($v, 0, $maxLen);
  return $v;
}
function is_ajax(): bool {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
         strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}
function json_response(array $payload, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($payload);
  exit;
}

// --- INPUT ---
$name     = clean($_POST['name']      ?? '', 120);
$email    = clean($_POST['email']     ?? '', 160);
$company  = clean($_POST['company']   ?? '', 160);
$jobRole  = clean($_POST['job_role']  ?? '', 160);
$industry = clean($_POST['industry']  ?? '', 160);
$phone    = clean($_POST['phone']     ?? '', 40);
$message  = clean($_POST['message']   ?? '', 2000);
$origin   = clean($_POST['origin']    ?? 'Website', 160);
$trap     = trim($_POST['website']    ?? '');

// --- HONEYPOT ---
if ($trap !== '') {
  // silently "succeed" to reduce signal to spammers
  if (is_ajax()) json_response(['ok' => true, 'message' => 'Thanks! We will reach out shortly.']);
  echo "<h1>Thank you!</h1><p>Your request has been sent. We will contact you soon.</p>";
  exit;
}

// --- VALIDATION ---
$fieldErrors = [];
if ($name === '')     $fieldErrors['name'] = 'Please enter your name.';
if ($email === '')    $fieldErrors['email'] = 'Please enter your email.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL))
  $fieldErrors['email'] = 'That email address looks invalid.';
if ($message === '')  $fieldErrors['message'] = 'Please tell us what you want to see.';

// Uncomment to make these required on the server too:
// if ($company === '')  $fieldErrors['company']  = 'Please enter your company name.';
// if ($jobRole === '')   $fieldErrors['jobRole']   = 'Please enter your job role.';
// if ($industry === '')  $fieldErrors['industry']  = 'Please enter your industry.';

if ($fieldErrors) {
  if (is_ajax()) json_response(['ok' => false, 'message' => 'Validation failed.', 'errors' => $fieldErrors], 422);
  http_response_code(422);
  echo "<!doctype html><meta charset='utf-8'><title>Submission error</title>
        <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px}
        .box{border:1px solid #FEE4E2;background:#FEF3F2;color:#B42318;border-radius:10px;padding:16px;max-width:720px}</style>
        <div class='box'><h1>Submission error</h1><ul>" .
        implode('', array_map(fn($m)=>"<li>".htmlspecialchars($m)."</li>", array_values($fieldErrors))) .
        "</ul><p><a href='javascript:history.back()'>Go back</a> and correct the highlighted fields.</p></div>";
  exit;
}

// --- EMAIL BODY ---
$subject = $SUBJECT_PREFIX . ' — ' . $name;
$when = date('Y-m-d H:i:s');

$lines = [
  "New demo request received:",
  "Time: $when",
  "Name: $name",
  "Email: $email",
  "Company: " . ($company ?: '—'),
  "Job role: " . ($jobRole ?: '—'),
  "Industry: " . ($industry ?: '—'),
  "Phone: " . ($phone ?: '—'),
  "Origin: $origin",
  str_repeat('-', 40),
  "Message:",
  $message,
];
$body = implode("\n", $lines);

// --- HEADERS ---
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "From: Cittanuvola <{$FROM_EMAIL}>";
$headers[] = "Reply-To: {$name} <{$email}>";
$additional_params = "-f {$FROM_EMAIL}"; // envelope sender

// --- SEND ---
$sent = @mail($TO_EMAIL, $subject, $body, implode("\r\n", $headers), $additional_params);

if ($sent) {
  if (is_ajax()) json_response(['ok' => true, 'message' => 'Thanks! We will reach out shortly.']);
  echo "<h1>Thank you!</h1><p>Your request has been sent. We will contact you soon.</p>";
} else {
  if (is_ajax()) json_response(['ok' => false, 'message' => 'Email could not be sent. Please try again.'], 500);
  http_response_code(500);
  echo "<!doctype html><meta charset='utf-8'><title>Oops</title>
        <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px}
        .box{border:1px solid #FEE4E2;background:#FEF3F2;color:#B42318;border-radius:10px;padding:16px;max-width:720px}</style>
        <div class='box'><h1>Oops!</h1><p>We couldn’t send your request right now. Please try again later.</p></div>";
}
