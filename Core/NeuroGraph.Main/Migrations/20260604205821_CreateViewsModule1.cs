using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class CreateViewsModule1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "biological_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    neuron_id = table.Column<Guid>(type: "uuid", nullable: false),
                    kind = table.Column<string>(type: "text", nullable: false),
                    cause = table.Column<string>(type: "text", nullable: true),
                    occurred_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_biological_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "neurons",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    label = table.Column<string>(type: "text", nullable: false),
                    x = table.Column<double>(type: "double precision", nullable: false),
                    y = table.Column<double>(type: "double precision", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    firing_threshold = table.Column<double>(type: "double precision", nullable: false),
                    energy = table.Column<double>(type: "double precision", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    died_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_neurons", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "biological_signals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    neuron_id = table.Column<Guid>(type: "uuid", nullable: false),
                    intensity = table.Column<float>(type: "real", nullable: false),
                    fired_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_biological_signals", x => x.id);
                    table.ForeignKey(
                        name: "fk_biological_signals_neurons_neuron_id",
                        column: x => x.neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "neural_connections",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    source_neuron_id = table.Column<Guid>(type: "uuid", nullable: false),
                    target_neuron_id = table.Column<Guid>(type: "uuid", nullable: false),
                    weight = table.Column<double>(type: "double precision", nullable: false),
                    is_excitatory = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_neural_connections", x => x.id);
                    table.ForeignKey(
                        name: "fk_neural_connections_neurons_source_neuron_id",
                        column: x => x.source_neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_neural_connections_neurons_target_neuron_id",
                        column: x => x.target_neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "neuron_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    neuron_id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    details = table.Column<string>(type: "text", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_neuron_logs", x => x.id);
                    table.ForeignKey(
                        name: "fk_neuron_logs_neurons_neuron_id",
                        column: x => x.neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_biological_signals_neuron_id",
                table: "biological_signals",
                column: "neuron_id");

            migrationBuilder.CreateIndex(
                name: "ix_neural_connections_source_neuron_id",
                table: "neural_connections",
                column: "source_neuron_id");

            migrationBuilder.CreateIndex(
                name: "ix_neural_connections_target_neuron_id",
                table: "neural_connections",
                column: "target_neuron_id");

            migrationBuilder.CreateIndex(
                name: "ix_neuron_logs_neuron_id",
                table: "neuron_logs",
                column: "neuron_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "biological_events");

            migrationBuilder.DropTable(
                name: "biological_signals");

            migrationBuilder.DropTable(
                name: "neural_connections");

            migrationBuilder.DropTable(
                name: "neuron_logs");

            migrationBuilder.DropTable(
                name: "neurons");
        }
    }
}
