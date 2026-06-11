using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class Baseline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Dropa a FK atual (nome real no banco)
            migrationBuilder.DropForeignKey(
                name: "neurons_logs_neuron_id_fkey",
                table: "neurons_logs");

            // Torna neuron_id nullable
            migrationBuilder.AlterColumn<Guid>(
                name: "neuron_id",
                table: "neurons_logs",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            // Recria a FK com SET NULL e com o nome que o EF espera
            migrationBuilder.AddForeignKey(
                name: "fk_neurons_logs_neurons_neuron_id",
                table: "neurons_logs",
                column: "neuron_id",
                principalTable: "neurons",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_neurons_logs_neurons_neuron_id",
                table: "neurons_logs");

            migrationBuilder.DropPrimaryKey(
                name: "pk_neurons_logs",
                table: "neurons_logs");

            migrationBuilder.RenameTable(
                name: "neurons_logs",
                newName: "neuron_logs");

            migrationBuilder.RenameIndex(
                name: "ix_neurons_logs_neuron_id",
                table: "neuron_logs",
                newName: "ix_neuron_logs_neuron_id");

            migrationBuilder.AlterColumn<float>(
                name: "intensity",
                table: "biological_signals",
                type: "real",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<Guid>(
                name: "neuron_id",
                table: "neuron_logs",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "pk_neuron_logs",
                table: "neuron_logs",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_neuron_logs_neurons_neuron_id",
                table: "neuron_logs",
                column: "neuron_id",
                principalTable: "neurons",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
