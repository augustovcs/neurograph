namespace NeuroGraph.Domain.Enums;

/// <summary>Tipos de eventos biológicos disparados por comportamentos randômicos-base.</summary>
public enum BiologicalEventType
{
    Fired = 0,
    ConnectionFormed = 1,
    ConnectionPruned = 2,
    Evolved = 3,
    Died = 4
}
