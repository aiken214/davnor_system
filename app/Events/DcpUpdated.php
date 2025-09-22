<?php

namespace App\Events;

use App\Models\Dcp;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class DcpUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $opcr;

    public function __construct(Dcp $dcp)
    {
        $this->dcp = $dcp;
    }

    public function broadcastOn()
    {
        return new Channel('dcps');
    }

    public function broadcastWith()
    {
        return [
            'dcp' => $this->dcp->toArray(),
        ];
    }
}
