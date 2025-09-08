<?php

namespace App\Events;

use Spatie\Permission\Models\Role;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class RolesUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $role;

    public function __construct(Role $role)
    {
        $this->role = $role;
    }

    public function broadcastOn()
    {
        return new Channel('roles');
    }

    public function broadcastWith()
    {
        return [
            'role' => $this->role->toArray(),
        ];
    }
}
