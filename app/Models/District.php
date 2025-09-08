<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class District extends Model
{
    use SoftDeletes;
    use HasFactory;

    public $table = 'districts';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'name',
        'division_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function division() {
        return $this->belongsTo(Division::class);
    }

}
