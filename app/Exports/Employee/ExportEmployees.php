<?php

namespace App\Exports\Employee;

use Maatwebsite\Excel\Concerns\FromArray;

class ExportEmployees implements FromArray
{
    protected $employees;

    public function __construct(array $employees)
    {
        $this->employees = $employees;
    }

    public function array(): array
    {
        return $this->employees;
    }
}
