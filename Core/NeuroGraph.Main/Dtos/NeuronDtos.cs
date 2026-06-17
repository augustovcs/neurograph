namespace NeuroGraph.Main.Dtos;

// Neurônios — leitura e criação
public record NeuronDto(Guid Id, string Label, double X, double Y, string Status, double Energy);
public record CreateNeuronDto(string Label, double X, double Y);
