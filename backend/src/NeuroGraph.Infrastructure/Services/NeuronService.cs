using Microsoft.EntityFrameworkCore;
using NeuroGraph.Application.Neurons;
using NeuroGraph.Domain.Entities;
using NeuroGraph.Infrastructure.Persistence;

namespace NeuroGraph.Infrastructure.Services;

public class NeuronService : INeuronService
{
    private readonly NeuroGraphDbContext _db;

    public NeuronService(NeuroGraphDbContext db) => _db = db;

    public async Task<IReadOnlyList<NeuronDto>> GetAllAsync(CancellationToken ct = default)
    {
        return await _db.Neurons
            .AsNoTracking()
            .OrderBy(n => n.CreatedAt)
            .Select(n => Map(n))
            .ToListAsync(ct);
    }

    public async Task<NeuronDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var neuron = await _db.Neurons.AsNoTracking().FirstOrDefaultAsync(n => n.Id == id, ct);
        return neuron is null ? null : Map(neuron);
    }

    public async Task<NeuronDto> CreateAsync(CreateNeuronRequest request, CancellationToken ct = default)
    {
        var neuron = new Neuron
        {
            Label = request.Label,
            PositionX = request.PositionX,
            PositionY = request.PositionY,
            Threshold = request.Threshold ?? -55.0
        };

        _db.Neurons.Add(neuron);
        await _db.SaveChangesAsync(ct);

        return Map(neuron);
    }

    private static NeuronDto Map(Neuron n) => new(
        n.Id, n.Label, n.Status, n.MembranePotential, n.Threshold,
        n.Generation, n.FireCount, n.PositionX, n.PositionY, n.CreatedAt, n.LastFiredAt);
}
