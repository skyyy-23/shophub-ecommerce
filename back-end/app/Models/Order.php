<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_price',
        'status',
    ];

    // Order belongs to a user
    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Order has many order items
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Order has many tracking records
    public function tracking()
    {
        return $this->hasMany(OrderTracking::class)->orderBy('created_at', 'desc');
    }
}