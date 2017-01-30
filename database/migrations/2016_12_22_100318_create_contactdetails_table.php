<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContactdetailsTable extends Migration
{

    public function up()
    {
        Schema::create('contact_details', function (Blueprint $table) {
            $table->increments('id');
            $table->string('puhelin')->nullable();
            $table->string('matkapuhelin')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contact_details');
    }
}
