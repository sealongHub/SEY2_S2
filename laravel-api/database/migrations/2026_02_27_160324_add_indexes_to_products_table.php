<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
    Schema::table('products', function (Blueprint $table) {
        $table->index('name');         // លឿនពេល Search ឈ្មោះ
        $table->index('category_id');  // លឿនពេល Join Category
        $table->index('brand_id');     // លឿនពេល Join Brand
        $table->index('status');       // លឿនពេល Filter Status
        $table->index('created_at');   // លឿនពេល Sort តាមថ្ងៃខែ
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
};
