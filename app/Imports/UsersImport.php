<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Skip if email already exists (to avoid duplicates)
        if (User::where('email', $row['email'])->exists()) {
            return null;
        }

        return new User([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password'] ?? 'password123'),
            'division_id' => $row['division_id'] ?? null,
            'school_id' => $row['school_id'] ?? null,
            'email_verified_at' => now(),
        ]);
    }
}
