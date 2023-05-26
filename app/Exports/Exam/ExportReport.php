<?php

namespace App\Exports\Exam;

use Maatwebsite\Excel\Concerns\FromArray;

class ExportReport implements FromArray
{
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function array(): array
    {
        return $this->data;
    }
}
