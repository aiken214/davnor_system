<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Opcr;

class Opcr extends Model
{
    use SoftDeletes, Auditable, HasFactory;
    
    protected $guarded = [];

    public function user() {
        return $this->belongsTo(User::class);
    }
}

