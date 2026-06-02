namespace NeuroGraph.Domain.Entities;

/// <summary>
/// Sinapse direcionada entre dois neurônios. Tabela: <c>neural_connections</c>.
/// </summary>
public class NeuralConnection
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SourceNeuronId { get; set; }
    public Neuron? Source { get; set; }

    public Guid TargetNeuronId { get; set; }
    public Neuron? Target { get; set; }

    /// <summary>Peso sináptico; influencia a propagação do sinal.</summary>
    public double Weight { get; set; } = 1.0;

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
