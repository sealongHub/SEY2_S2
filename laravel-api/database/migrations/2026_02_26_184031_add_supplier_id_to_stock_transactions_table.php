<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('stock_transactions', function (Blueprint $table) {
            // បន្ថែម supplier_id បន្ទាប់ពី product_id
            $table->foreignId('supplier_id')
                ->nullable() 
                ->after('product_id')
                ->constrained()
                ->onDelete('set null'); 
        });
    }

    public function down()
    {
        Schema::table('stock_transactions', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']);
            $table->dropColumn('supplier_id');
        });
    }
};
