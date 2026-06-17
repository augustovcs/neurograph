namespace NeuroGraph.Main.Dtos;

// Configuração da simulação exposta ao Editor (espelha a entity SimulationConfig)
public record SimulationConfigDto(
    ConfigParameterDto FireChancePerTick,
    ConfigParameterDto EvolveChancePerTick,
    ConfigParameterDto DeathChancePerTick,
    ConfigParameterDto EnergyCostPerFire,
    ConfigParameterDto EnergyRegenPerTick);

public record ConfigParameterDto(double Value, bool Pinned, double Min, double Max);
