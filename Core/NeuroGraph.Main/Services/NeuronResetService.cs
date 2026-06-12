using NeuroGraph.Main.Interfaces;
using NeuroGraph.Main.Data;
using Microsoft.EntityFrameworkCore;

namespace NeuroGraph.Main.Services;

public class NeuronResetService : INeuronResetService
{
    private readonly AppDbContext _db;

    public NeuronResetService(AppDbContext db) => _db = db;

    public async Task ResetAllAsync()
    {
        await _db.NeuralConnections.ExecuteDeleteAsync();
        await _db.Neurons.ExecuteDeleteAsync();
        // NeuronLogs são preservados; neuron_id fica NULL pelo SET NULL da FK
    }
}
