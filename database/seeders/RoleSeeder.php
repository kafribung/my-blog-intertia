<?php

namespace Database\Seeders;

use App\Models;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = Models\User::whereEmail('kafribung07@gmail.com')->first();
        $role = Role::create(['name' => 'admin']);

        if ($user) {
            $user->assignRole($role);
        }
    }
}
