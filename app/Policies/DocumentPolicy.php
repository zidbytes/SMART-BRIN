<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Document;

class DocumentPolicy
{
    /**
     * View permission: researcher hanya bisa melihat dokumennya sendiri,
     * head dan monev bisa melihat semua dokumen.
     */
    public function view(User $user, Document $document): bool
    {
        return $user->role !== 'researcher' || $user->id === $document->user_id;
    }

    /**
     * Update permission:
     * - head & researcher: bisa update dokumen milik sendiri, TAPI tidak boleh update kolom monev_stamp dan bulan.
     * - monev: hanya bisa update status, notes, dan monev_stamp.
     */
    public function update(User $user, Document $document): bool
    {
        if ($user->role === 'monev') {
            return true;
        }

        if ($user->role === 'head') {
            return true;
        }

        return $user->role === 'researcher' && $user->id === $document->user_id;
    }

    /**
     * Delete permission:
     * - hanya head dan researcher (atas dokumen miliknya sendiri) yang bisa hapus
     * - monev tidak bisa hapus dokumen
     */
    public function delete(User $user, Document $document): bool
    {
        if ($user->role === 'head') {
            return true;
        }

        return $user->role === 'researcher' && $user->id === $document->user_id;
    }

    /**
     * Create permission:
     * - hanya researcher dan head yang bisa buat dokumen
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['researcher', 'head']);
    }
}
