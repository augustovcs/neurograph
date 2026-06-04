using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations;

    /// <inheritdoc />
    public partial class CreateViews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
  {
      migrationBuilder.Sql(@"
          CREATE VIEW vw_neuron_longevity AS
          SELECT n.id AS neuron_id,
                 n.label,
                 EXTRACT(EPOCH FROM (COALESCE(n.died_at, NOW()) - n.created_at))::int AS lifetime_seconds,
                 (SELECT COUNT(*) FROM biological_events e
                  WHERE e.neuron_id = n.id AND e.kind = 'evolution') AS evolution_count
          FROM neurons n;
      ");

      migrationBuilder.Sql(@"
          CREATE VIEW vw_neuron_death_stats AS
          SELECT COALESCE(e.cause, 'desconhecida') AS cause,
                 COUNT(*) AS death_count
          FROM biological_events e
          WHERE e.kind = 'death'
          GROUP BY e.cause;
      ");

      migrationBuilder.Sql(@"
          CREATE VIEW vw_best_events AS
          SELECT e.id AS event_id, e.neuron_id, e.kind, e.cause, e.occurred_at
          FROM biological_events e
          ORDER BY e.occurred_at DESC;
      ");
  }

  protected override void Down(MigrationBuilder migrationBuilder)
  {
      migrationBuilder.Sql("DROP VIEW IF EXISTS vw_best_events;");
      migrationBuilder.Sql("DROP VIEW IF EXISTS vw_neuron_death_stats;");
      migrationBuilder.Sql("DROP VIEW IF EXISTS vw_neuron_longevity;");
  }
}

