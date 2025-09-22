<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DcpItemStatus extends Model
{
    use SoftDeletes;
    use HasFactory;

    public $table = 'dcp_item_statuses';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'working',
        'repairable',
        'replacement',
        'unrepairable',
        'stolen',
        'remarks',
        'dcp_recipient_id',
        'dcp_item_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function dcp_item() {
        return $this->belongsTo(DcpItem::class);
    }

    public function dcp_recipient() {
        return $this->belongsTo(DcpRecipient::class);
    }
}
