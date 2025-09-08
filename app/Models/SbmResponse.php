<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SbmResponse extends Model
{
    
    use SoftDeletes;
    use HasFactory;

    public $table = 'sbm_responses';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'indicator_id',
        'status',
        'remarks',
        'user_id',
        'sbm_checklist_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function sbm_checklist() {
        return $this->belongsTo(SbmChecklist::class);
    }

}
