<?php

namespace App\Events;

use App\Models\DcpRecipient;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class DcpRecipientUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $opcr;

    public function __construct(DcpRecipient $dcp_recipient)
    {
        $this->dcp_recipient = $dcp_recipient;
    }

    public function broadcastOn()
    {
        return new Channel('dcp_recipients');
    }

    public function broadcastWith()
    {
        return [
            'dcp_recipient' => $this->dcp->toArray(),
        ];
    }
}
