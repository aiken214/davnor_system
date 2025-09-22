<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DcpRecipient extends Model
{
    use SoftDeletes;
    use HasFactory;

    public $table = 'dcp_recipients';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'id',
        'allocation',
        'date_delivery',
        'file',
        'slug',
        'remarks',
        'dcp_id',
        'school_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function dcp() {
        return $this->belongsTo(Dcp::class);
    }

    public function school() {
        return $this->belongsTo(School::class);
    }
}
