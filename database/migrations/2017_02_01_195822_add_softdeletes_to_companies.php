<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSoftdeletesToCompanies extends Migration
{

    public function up()
    {
        Schema::table('companies', function($table) {
            $table->softDeletes();
        });
    }

    public function down()
    {
       $table->dropColumn('deleted_at');
    }
}
