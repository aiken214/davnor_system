<?php

namespace App\Models;


use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class TicketAttachment extends Model
{
    use Auditable, HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'ticket_id', 
        'comment_id',
        'slug', 
        'file_path', 
        'file_name', 
        'uploaded_by', 
        'uploaded_at'
    ];

    protected $dates = ['uploaded_at'];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function comment(): BelongsTo
    {
        return $this->belongsTo(TicketComment::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
