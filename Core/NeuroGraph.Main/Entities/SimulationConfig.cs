namespace NeuroGraph.Main.Entities
{
    /// <summary>
    /// Configuração da simulação. Fase 1: linha única (Id = 1), sem versionamento.
    /// Cada parâmetro carrega seu valor, se está fixado (pinned) e os limites válidos.
    /// </summary>
    public class SimulationConfig
    {
        public int Id { get; set; }   // sempre 1 nesta fase (single-row)

        // Comportamentos randômicos-base (probabilidade por tick)
        public ConfigParameter FireChancePerTick { get; set; } = new();
        public ConfigParameter EvolveChancePerTick { get; set; } = new();
        public ConfigParameter DeathChancePerTick { get; set; } = new();

        // Energia
        public ConfigParameter EnergyCostPerFire { get; set; } = new();   // custo de disparar
        public ConfigParameter EnergyRegenPerTick { get; set; } = new();  // regeneração por tick

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Parâmetro configurável: valor atual, se está fixado e o intervalo válido.
    /// Quando <see cref="Pinned"/> é falso o valor é randomizado dentro de [Min, Max].
    /// </summary>
    public class ConfigParameter
    {
        public double Value { get; set; }
        public bool Pinned { get; set; }
        public double Min { get; set; }
        public double Max { get; set; }
    }
}
