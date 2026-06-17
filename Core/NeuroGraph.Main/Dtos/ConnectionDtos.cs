namespace NeuroGraph.Main.Dtos;

// Conexões neurais (sinapses)
public record ConnectionDto(Guid Id, Guid Source, Guid Target, double Weight, bool IsExcitatory);
