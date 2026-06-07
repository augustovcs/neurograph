namespace Api.Entities.Views;

public class NeuronDeathStatsView
{
    public string Cause { get; set; } = string.Empty;
    public int DeathCount { get; set; }
}