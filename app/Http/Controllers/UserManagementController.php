<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorizeHeadOnly();

        $users = User::orderBy('id', 'asc')->get();

        return Inertia::render('accountmanagement', [
            'users' => $users
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $this->authorizeHeadOnly();

        $validated = $this->validateRole($request);

        DB::beginTransaction();
        try {
            $user->update(['role' => $validated['role']]);
            DB::commit();

            return back()->with('success', 'Role berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Gagal memperbarui role pengguna.'
            ]);
        }
    }

    public function destroy(User $user)
    {
        $this->authorizeHeadOnly();

        if (Auth::id() === $user->id) {
            return back()->withErrors([
                'error' => 'Anda tidak dapat menghapus akun Anda sendiri.'
            ]);
        }

        DB::beginTransaction();
        try {
            $user->delete();
            DB::commit();

            return back()->with('success', 'User berhasil dihapus.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Gagal menghapus user.'
            ]);
        }
    }

    private function authorizeHeadOnly(): void
    {
        $this->authorize('manageUsers', User::class);
    }

    private function validateRole(Request $request): array
    {
        return $request->validate([
            'role' => 'required|in:head,researcher,monev',
        ]);
    }
}
