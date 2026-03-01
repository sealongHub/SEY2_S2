<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
    // Drop the index if it exists first to prevent the 'FAIL'
    $table->dropIndex(['name'])->nullable(); 
    
    // Add them fresh
    $table->index('name', 'idx_prod_name');
    $table->index('status', 'idx_prod_status');
    $table->index('category_id', 'idx_prod_cat');
    $table->index('brand_id', 'idx_prod_brand');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
