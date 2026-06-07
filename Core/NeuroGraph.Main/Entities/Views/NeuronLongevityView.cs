namespace Api.Entities.Views;

public class NeuronLongevityView
{
    public Guid NeuronId { get; set; }
    public string Label { get; set; } = string.Empty;
    public int LifetimeSeconds { get; set; }
    public int EvolutionCount { get; set; }
}