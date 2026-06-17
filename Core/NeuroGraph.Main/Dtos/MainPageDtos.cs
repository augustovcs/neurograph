namespace NeuroGraph.Main.Dtos;

// Dados dos cards superiores da Main (relatório resumido)
public record MainPageDataDto(
    int ActiveNeurons,
    int PropagatedSignals,
    int NeuralConnections,
    int EventsPerMinute);
