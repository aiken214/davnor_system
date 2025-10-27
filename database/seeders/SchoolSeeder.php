<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        $file = database_path('seeders/data/schools.csv');

        if (!file_exists($file) || !is_readable($file)) {
            return;
        }

        $header = null;
        $data = [];

        if (($handle = fopen($file, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (!$header) {
                    $header = $row;
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }

        foreach ($data as $school) {
            School::updateOrCreate(
                
                [
                    'name'           => $school['name'],
                    'district_id'    => $school['district_id'] ?: null,
                    'address'        => $school['address'] ?: null,
                    'school_head'    => $school['school_head'] ?: null,
                    'position'       => $school['position'] ?: null,
                    'contact_number' => $school['contact_number'] ?: null,
                    'email'          => $school['email'] ?: null,
                ]
            );
        }
    }
}
