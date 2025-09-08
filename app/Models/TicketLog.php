<?php

namespace App\Models;


use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketLog extends Model
{
    use SoftDeletes, Auditable, HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'ticket_id', 
        'action', 
        'old_value', 
        'new_value', 
        'user_id', 
        'created_at'
    ];

    protected $dates = ['created_at'];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
