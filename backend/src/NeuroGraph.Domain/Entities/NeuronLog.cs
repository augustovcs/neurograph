namespace NeuroGraph.Domain.Entities;

/// <summary>
/// Registro histórico de alterações de estado de um neurônio. Tabela: <c>neurons_logs</c>.
/// </summary>
public class NeuronLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid NeuronId { get; set; }
    public Neuron? Neuron { get; set; }

    public string Action { get; set; } = string.Empty;

    /// <summary>Snapshot do potencial de membrana no momento do log.</summary>
    public double PotentialSnapshot { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
