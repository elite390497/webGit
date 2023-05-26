<?php

namespace App\Http\Resources\Academic;

use App\Helper\Cal;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Employee\Summary as EmployeeSummaryResource;
use App\Http\Resources\Academic\BatchSummary as BatchSummaryResource;

class ClassTeacher extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'batch'       => new BatchSummaryResource($this->whenLoaded('batch')),
            'employee'    => new EmployeeSummaryResource($this->whenLoaded('employee')),
            'date_effective'  => $this->date_effective,
            'description' => $this->description,
            'created_at'  => $this->when(request('q') === 'all', Cal::toDateTime($this->created_at)),
            'updated_at'  => $this->when(request('q') === 'all', Cal::toDateTime($this->updated_at))
        ];
    }
}