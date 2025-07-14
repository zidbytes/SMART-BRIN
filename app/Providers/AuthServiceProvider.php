<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
// Models
use App\Models\Document;
use App\Models\User; // <-- 1. TAMBAHKAN INI

// Policies
use App\Policies\DocumentPolicy;
use App\Policies\UserPolicy; // <-- 2. TAMBAHKAN INI

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Document::class => DocumentPolicy::class,
        User::class => DocumentPolicy::class, // <-- 3. TAMBAHKAN BARIS INI
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}