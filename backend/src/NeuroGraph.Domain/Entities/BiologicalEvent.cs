using NeuroGraph.Domain.Enums;

namespace NeuroGraph.Domain.Entities;

/// <summary>
/// Evento biológico gerado por comportamentos randômicos-base
/// (disparo, evolução, morte, formação de conexão). Tabela: <c>biological_events</c>.
/// </summary>
public class BiologicalEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? NeuronId { get; set; }
    public Neuron? Neuron { get; set; }

    public BiologicalEventType Type { get; set; }

    public string? Description { get; set; }

    /// <summary>
    /// Qualidade do evento (0..1). Usada pela view de "eventos melhor realizados".
    /// </summary>
    public double OutcomeScore { get; set; }

    public DateTimeOffset OccurredAt { get; set; } = DateTimeOffset.UtcNow;
}
