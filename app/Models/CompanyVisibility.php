<?php

namespace App\Models\Backend;

use Illuminate\Database\Eloquent\Model;

class CompanyVisibility extends Model
{
	protected $table = 'company_visibility';
    protected $fillable = ['company_id', 'visibility_id'];
}