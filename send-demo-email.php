<?php
// send-demo-email.php

header('Content-Type: application/json; charset=UTF-8');

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
  exit;
}

// Basic anti-bot: honeypot
if (!empty($_POST['website'])) {
  // silently pretend success to confuse bots
  echo json_encode(['ok' => true, 'message' => 'Thanks!']);
  exit;
}

// Sanitize inputs
$fullName = trim(filter_input(INPUT_POST, 'fullName', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$email    = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
$company  = trim(filter_input(INPUT_POST, 'company', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$jobRole  = trim(filter_input(INPUT_POST, 'jobRole', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$industry = trim(filter_input(INPUT_POST, 'industry', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

// Validate required fields
if ($fullName === '' || $email === '' || $company === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Please fill the required fields correctly.']);
  exit;
}

// === PHPMailer via Composer ===
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
  // SMTP config (replace with your real values)
  $mail->isSMTP();
  $mail->Host       = 'mail.cittanuvola.com';  // e.g., mail.cittanuvola.com
  $mail->SMTPAuth   = true;
  $mail->Username   = 'olugbenga.ezekiel@cittanuvola.com';
  $mail->Password   = 'Citta18042025';
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // or PHPMailer::ENCRYPTION_SMTPS for 465
  $mail->Port       = 587;

  // From / To
  $mail->setFrom('olugbenga.ezekiel@cittanuvola.com', 'CittaERP Demo Bot');
  // where you want to receive the requests:
  $mail->addAddress('olugbenga.ezekiel@cittanuvola.com', 'Sales Team');

  // Optional: reply-to the requester
  $mail->addReplyTo($email, $fullName);

  // Content
  $mail->isHTML(true);
  $mail->Subject = 'New Demo Request from ' . $fullName;
  $mail->Body    = "
    <h2>New CittaERP Demo Request</h2>
    <p><strong>Name:</strong> {$fullName}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Company:</strong> {$company}</p>
    <p><strong>Job Role:</strong> {$jobRole}</p>
    <p><strong>Industry:</strong> {$industry}</p>
    <hr>
    <p>Sent from the website demo form.</p>
  ";
  $mail->AltBody = "New Demo Request\n\nName: {$fullName}\nEmail: {$email}\nCompany: {$company}\nJob Role: {$jobRole}\nIndustry: {$industry}";

  $mail->send();
  echo json_encode(['ok' => true, 'message' => 'Thanks! Your request has been sent.']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Could not send email. Please try again later.']);
}
