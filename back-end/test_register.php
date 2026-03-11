<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Http;

// Check if email exists
$emailExists = User::where('email', 'test@example.com')->exists();
echo "Email exists: " . ($emailExists ? 'YES' : 'NO') . "\n";

// Test registration
try {
    $response = Http::post('http://127.0.0.1:8000/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'role' => 'user'
    ]);

    echo "Status: " . $response->status() . "\n";
    echo "Response: " . $response->body() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}