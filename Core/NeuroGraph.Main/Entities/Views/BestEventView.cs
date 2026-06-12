namespace NeuroGraph.Main.Entities.Views;


public class BestEventView
{
    public Guid EventId { get; set; }
    public Guid NeuronId { get; set; }
    public string Kind { get; set; } = string.Empty;   // "death" | "evolution"
    public string? Cause { get; set; }
    public DateTime OccurredAt { get; set; }
}