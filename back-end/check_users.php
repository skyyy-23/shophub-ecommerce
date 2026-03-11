<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "Total users: " . User::count() . "\n";
foreach(User::all() as $user) {
    echo $user->email . ' (' . $user->role . ')' . "\n";
}