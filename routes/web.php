<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\SchoolController;
use App\Http\Controllers\Admin\DistrictController;
use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Osds\OpcrController;
use App\Http\Controllers\Osds\DcpController;
use App\Http\Controllers\Osds\DcpItemController;
use App\Http\Controllers\Osds\DcpItemStatusController;
use App\Http\Controllers\Osds\DcpRecipientController;
use App\Http\Controllers\Osds\TicketController;
use App\Http\Controllers\Osds\TicketCategoryController;
use App\Http\Controllers\Osds\TicketCommentController;
use App\Http\Controllers\Sgod\SbmChecklistController;
use App\Http\Controllers\Sgod\SbmIndicatorController;
use App\Http\Controllers\Sgod\SbmResponseController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware('role:Super_Admin')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
    });

    Route::middleware('role:Super_Admin|Admin')->group(function () {
        Route::resource('users', UserController::class);    
        Route::resource('schools', SchoolController::class);    
        Route::resource('divisions', DivisionController::class);
        Route::resource('districts', DistrictController::class);
    });

    Route::middleware('role:Super_Admin|User')->group(function () {

    });

    //OSDS
    Route::resource('opcrs', OpcrController::class);
    Route::post('/opcrs/{id}/approve', [OpcrController::class, 'approve'])->name('opcrs.approve');
    Route::resource('dcps', DcpController::class);

    Route::get('/dcp-items/create/{dcp}', [DcpItemController::class, 'create']);
    Route::get('/dcp-items/show/{dcp}', [DcpItemController::class, 'show']);
    Route::get('/dcp-items/{dcp}', [DcpItemController::class, 'index']);
    Route::resource('dcp-items', DcpItemController::class);

    Route::get('/dcp-recipients/create/{dcp}', [DcpRecipientController::class, 'create']);
    Route::get('/dcp-recipients/show/{dcp}', [DcpRecipientController::class, 'show']);
    Route::get('/dcp-recipients/{dcp}', [DcpRecipientController::class, 'index'])->name('dcp-recipients.index2');
    Route::resource('dcp-recipients', DcpRecipientController::class);
    
    Route::get('/dcp-item-status/create/{dcp_recipient}', [DcpItemStatusController::class, 'create']);
    Route::get('/dcp-item-status/show/{dcp_item_status}', [DcpItemStatusController::class, 'show']);
    Route::get('/dcp-item-status/{dcp_recipient}', [DcpItemStatusController::class, 'index'])->name('dcp-item-status.index2');
    Route::resource('dcp-item-status', DcpItemStatusController::class);

    Route::resource('/tickets', TicketController::class);
    Route::post('/tickets/{ticket}/comments', [TicketCommentController::class, 'store']);
    Route::post('/tickets/{ticket}/assign', [TicketController::class, 'assign']);
    Route::post('/tickets/{ticket}/status', [TicketController::class, 'updateStatus']);

    Route::resource('/ticket-categories', TicketCategoryController::class);

    //SGOD
    Route::resource('sbm-checklists', SbmChecklistController::class);
    Route::post('/sbm-checklists/{id}/approve', [SbmChecklistController::class, 'approve'])->name('sbm_checklists.approve');
    Route::resource('sbm-indicators', SbmIndicatorController::class);
    Route::resource('sbm-responses', SbmResponseController::class);
    Route::get('/sbm-responses/{sbm_checklist}/editResponse', [SbmResponseController::class, 'editResponse'])->name('sbm-responses.editResponse');
    Route::get('/sbm-checklists/print/{id}', [SbmChecklistController::class, 'print'])->name('sbm-checklists.print');
    
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
