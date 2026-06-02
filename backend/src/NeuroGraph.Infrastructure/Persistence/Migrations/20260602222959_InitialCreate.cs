using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuroGraph.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "neurons",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    label = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    membrane_potential = table.Column<double>(type: "double precision", nullable: false),
                    threshold = table.Column<double>(type: "double precision", nullable: false),
                    generation = table.Column<int>(type: "integer", nullable: false),
                    fire_count = table.Column<int>(type: "integer", nullable: false),
                    position_x = table.Column<double>(type: "double precision", nullable: false),
                    position_y = table.Column<double>(type: "double precision", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_fired_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    died_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_neurons", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "biological_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    neuron_id = table.Column<Guid>(type: "uuid", nullable: true),
                    type = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    outcome_score = table.Column<double>(type: "double precision", nullable: false),
                    occurred_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_biological_events", x => x.id);
                    table.ForeignKey(
                        name: "FK_biological_events_neurons_neuron_id",
                        column: x => x.neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "biological_signals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    neuron_id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<int>(type: "integer", nullable: false),
                    intensity = table.Column<double>(type: "double precision", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_biological_signals", x => x.id);
                    table.ForeignKey(
                        name: "FK_biological_signals_neurons_neuron_id",
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
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_neural_connections", x => x.id);
                    table.ForeignKey(
                        name: "FK_neural_connections_neurons_source_neuron_id",
                        column: x => x.source_neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_neural_connections_neurons_target_neuron_id",
                        column: x => x.target_neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "neurons_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    neuron_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    potential_snapshot = table.Column<double>(type: "double precision", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_neurons_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_neurons_logs_neurons_neuron_id",
                        column: x => x.neuron_id,
                        principalTable: "neurons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_biological_events_neuron_id",
                table: "biological_events",
                column: "neuron_id");

            migrationBuilder.CreateIndex(
                name: "IX_biological_events_occurred_at",
                table: "biological_events",
                column: "occurred_at");

            migrationBuilder.CreateIndex(
                name: "IX_biological_events_type",
                table: "biological_events",
                column: "type");

            migrationBuilder.CreateIndex(
                name: "IX_biological_signals_neuron_id",
                table: "biological_signals",
                column: "neuron_id");

            migrationBuilder.CreateIndex(
                name: "IX_neural_connections_source_neuron_id_target_neuron_id",
                table: "neural_connections",
                columns: new[] { "source_neuron_id", "target_neuron_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_neural_connections_target_neuron_id",
                table: "neural_connections",
                column: "target_neuron_id");

            migrationBuilder.CreateIndex(
                name: "IX_neurons_status",
                table: "neurons",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_neurons_logs_neuron_id",
                table: "neurons_logs",
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
                name: "neurons_logs");

            migrationBuilder.DropTable(
                name: "neurons");
        }
    }
}
