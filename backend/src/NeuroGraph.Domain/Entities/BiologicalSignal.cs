using NeuroGraph.Domain.Enums;

namespace NeuroGraph.Domain.Entities;

/// <summary>
/// Sinal biológico que trafega a partir de um neurônio. Tabela: <c>biological_signals</c>.
/// </summary>
public class BiologicalSignal
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid NeuronId { get; set; }
    public Neuron? Neuron { get; set; }

    public SignalType Type { get; set; } = SignalType.Excitatory;

    /// <summary>Intensidade do sinal.</summary>
    public double Intensity { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
