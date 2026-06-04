public class NeuronLongevityView
{
    public Guid NeuronId { get; set; }
    public string Label { get; set; } = string.Empty;
    public int LifetimeSeconds { get; set; }
    public int EvolutionCount { get; set; }
}

public class NeuronDeathStatsView
{
    public string Cause { get; set; } = string.Empty;
    public int DeathCount { get; set; }
}

public class BestEventView
{
    public Guid EventId { get; set; }
    public Guid NeuronId { get; set; }
    public string Kind { get; set; } = string.Empty;   // death | evolution
    public string? Cause { get; set; }
    public DateTime OccurredAt { get; set; }
}