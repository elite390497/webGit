<?php

namespace App\Exports\Student;

use Maatwebsite\Excel\Concerns\FromArray;

class ExportStudents implements FromArray
{
    protected $students;

    public function __construct(array $students)
    {
        $this->students = $students;
    }

    public function array(): array
    {
        return $this->students;
    }
}
