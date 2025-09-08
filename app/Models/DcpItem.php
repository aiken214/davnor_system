<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DcpItem extends Model
{
    use SoftDeletes;
    use HasFactory;

    public $table = 'dcp_items';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'description',
        'quantity',
        'dcp_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function dcp() {
        return $this->belongsTo(Dcp::class);
    }
}
