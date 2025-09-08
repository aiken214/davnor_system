<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        
        try {
            foreach (Permission::all() as $permission) {
                Gate::define($permission->name, function (User $user) use ($permission) {
                    return $user->hasPermissionTo($permission->name);
                });
            }
        } catch (\Throwable $e) {
            // Log or ignore — likely during install or migration
            // logger()->error($e);
        }
    }
}
