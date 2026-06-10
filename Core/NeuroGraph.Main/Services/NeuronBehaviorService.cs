using Neurograph.Services;
using Api.Entities;
using NeuroGraph.Main.Data;
using Microsoft.EntityFrameworkCore;

namespace Neurograph.Services;


public class NeuronBehaviorService : INeuronBehaviorService
{
    private readonly AppDbContext _db;
    private readonly BehaviorSettings _settings;
    private static readonly Random _rng = new();

    public NeuronBehaviorService(AppDbContext db, BehaviorSettings settings)
    {
        _db = db;
        _settings = settings;
    }

    


    public async Task RunTickAsync()
    {
        var neurons = await _db.Neurons
            .Where(n => n.Status == "alive")
            .ToListAsync();

        foreach (var n in neurons)
        {
            // 1) Chance de disparar
            if (_rng.NextDouble() < _settings.FireChancePerTick)
            {
                _db.BiologicalSignals.Add(new BiologicalSignal
                {
                    NeuronId = n.Id,
                    Intensity = _rng.NextDouble()
                });
                _db.NeuronLogs.Add(new NeuronLog { NeuronId = n.Id, Type = "fired" });
                n.Energy -= _settings.EnergyCostPerFire;
            }

            // 2) Chance de evoluir
            if (_rng.NextDouble() < _settings.EvolveChancePerTick)
            {
                n.Status = "evolving";
                _db.BiologicalEvents.Add(new BiologicalEvent { NeuronId = n.Id, Kind = "evolution" });
                _db.NeuronLogs.Add(new NeuronLog { NeuronId = n.Id, Type = "evolved" });
            }

            // 3) Chance de morrer (ou morte por energia esgotada)
            bool randomDeath = _rng.NextDouble() < _settings.DeathChancePerTick;
            if (randomDeath || n.Energy <= 0)
            {
                n.Status = "dead";
                n.DiedAt = DateTime.UtcNow;
                _db.BiologicalEvents.Add(new BiologicalEvent
                {
                    NeuronId = n.Id,
                    Kind = "death",
                    Cause = n.Energy <= 0 ? "energia esgotada" : "morte aleatória"
                });
                _db.NeuronLogs.Add(new NeuronLog { NeuronId = n.Id, Type = "died" });
            }
        }

        await _db.SaveChangesAsync();   // grava TUDO de uma vez (uma transação)
    }
}