<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dcp extends Model
{
    use SoftDeletes;
    use HasFactory;

    public $table = 'dcps';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'batch',
        'year',
        'configuration',
        'supplier',
        'slug',
        'file',
        'status',
        'remarks',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

}