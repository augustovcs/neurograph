namespace NeuroGraph.Domain.Enums;

/// <summary>Estado de vida de um neurônio na simulação.</summary>
public enum NeuronStatus
{
    Idle = 0,
    Firing = 1,
    Evolved = 2,
    Dead = 3
}
