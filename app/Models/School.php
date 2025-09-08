<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use SoftDeletes;
    use HasFactory;

    public $table = 'schools';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'name',
        'depedsch_id',
        'district_id',
        'address',
        'contact_number',
        'email',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function district() {
        return $this->belongsTo(District::class);
    }

}
