<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Columns that can be mass-assigned
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    // Timestamps are present, so no need to disable them
    public $timestamps = true;

    // Relationships
    public function orders(){
        return $this->hasMany(Order::class);
    }
}