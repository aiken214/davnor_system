<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SbmIndicator extends Model
{
     use SoftDeletes;
    use HasFactory;

    public $table = 'sbm_indicators';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'description',
        'area',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

}
