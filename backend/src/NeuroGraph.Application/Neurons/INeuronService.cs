namespace NeuroGraph.Application.Neurons;

public interface INeuronService
{
    Task<IReadOnlyList<NeuronDto>> GetAllAsync(CancellationToken ct = default);
    Task<NeuronDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<NeuronDto> CreateAsync(CreateNeuronRequest request, CancellationToken ct = default);
}
