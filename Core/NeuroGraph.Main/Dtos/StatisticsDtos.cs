namespace NeuroGraph.Main.Dtos;

// Statistics — saída projetada a partir das Views (read-only)
public record LongevityDto(Guid NeuronId, string Label, int LifetimeSeconds, int EvolutionCount);
public record DeathStatsDto(string Cause, int DeathCount);
public record BestEventDto(Guid EventId, Guid NeuronId, string Kind, string? Cause, DateTime OccurredAt);
