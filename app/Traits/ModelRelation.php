<?php

namespace App\Traits;

trait ModelRelation
{
    /**
     * Get all relations
     * @return array
     */
    public function relations()
    {
    	return [
            'institute_document' => 'App\Models\Institute\InstituteDocument'
        ];
    }
}