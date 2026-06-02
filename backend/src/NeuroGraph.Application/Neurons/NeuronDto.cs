using NeuroGraph.Domain.Enums;

namespace NeuroGraph.Application.Neurons;

/// <summary>Representação de leitura de um neurônio para o front (React Flow).</summary>
public record NeuronDto(
    Guid Id,
    string Label,
    NeuronStatus Status,
    double MembranePotential,
    double Threshold,
    int Generation,
    int FireCount,
    double PositionX,
    double PositionY,
    DateTimeOffset CreatedAt,
    DateTimeOffset? LastFiredAt);

/// <summary>Payload para criação de um neurônio.</summary>
public record CreateNeuronRequest(
    string Label,
    double PositionX,
    double PositionY,
    double? Threshold);
