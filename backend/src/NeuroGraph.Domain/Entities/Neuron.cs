using NeuroGraph.Domain.Enums;

namespace NeuroGraph.Domain.Entities;

/// <summary>
/// Unidade central da simulação. Tabela: <c>neurons</c>.
/// Posição (X,Y) é usada pelo React Flow no front.
/// </summary>
public class Neuron
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Label { get; set; } = string.Empty;

    public NeuronStatus Status { get; set; } = NeuronStatus.Idle;

    /// <summary>Potencial de membrana atual (mV simbólico).</summary>
    public double MembranePotential { get; set; }

    /// <summary>Limiar a partir do qual o neurônio dispara.</summary>
    public double Threshold { get; set; } = -55.0;

    /// <summary>Geração / nível de evolução acumulado.</summary>
    public int Generation { get; set; }

    public int FireCount { get; set; }

    public double PositionX { get; set; }

    public double PositionY { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? LastFiredAt { get; set; }

    public DateTimeOffset? DiedAt { get; set; }

    // Navegação
    public ICollection<NeuralConnection> OutgoingConnections { get; set; } = new List<NeuralConnection>();
    public ICollection<NeuralConnection> IncomingConnections { get; set; } = new List<NeuralConnection>();
    public ICollection<NeuronLog> Logs { get; set; } = new List<NeuronLog>();
    public ICollection<BiologicalSignal> Signals { get; set; } = new List<BiologicalSignal>();
    public ICollection<BiologicalEvent> Events { get; set; } = new List<BiologicalEvent>();
}
