<?php

namespace App\Events;

use App\Models\Opcr;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class OpcrUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $opcr;

    public function __construct(Opcr $opcr)
    {
        $this->opcr = $opcr;
    }

    public function broadcastOn()
    {
        return new Channel('opcrs');
    }

    public function broadcastWith()
    {
        return [
            'opcr' => $this->opcr->toArray(),
        ];
    }
}
