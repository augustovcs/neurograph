using NeuroGraph.Main.Interfaces;
using NeuroGraph.Main.Data;
using Microsoft.EntityFrameworkCore;
using NeuroGraph.Main.Entities;
using NeuroGraph.Main.Dtos;


namespace NeuroGraph.Main.Services;


public class NeuronBehaviorService : INeuronBehaviorService
{
    private readonly AppDbContext _db;
    private readonly ISimulationConfigService _config;
    private static readonly Random _rng = new();

    public NeuronBehaviorService(AppDbContext db, ISimulationConfigService config)
    {
        _db = db;
        _config = config;
    }

    public async Task RunTickAsync()
    {
        // Config vem do banco. Parâmetro fixado (pinned) usa o valor; não fixado é
        // re-sorteado dentro de [Min, Max] uma vez por tick.
        var cfg = await _config.GetConfigAsync();
        var fireChance = Resolve(cfg.FireChancePerTick);
        var evolveChance = Resolve(cfg.EvolveChancePerTick);
        var deathChance = Resolve(cfg.DeathChancePerTick);
        var energyCost = Resolve(cfg.EnergyCostPerFire);
        var energyRegen = Resolve(cfg.EnergyRegenPerTick);

        var neurons = await _db.Neurons
            .Where(n => n.Status == "alive")
            .ToListAsync();

        foreach (var n in neurons)
        {
            // 0) Regeneração de energia do tick
            n.Energy += energyRegen;

            // 1) Chance de disparar
            if (_rng.NextDouble() < fireChance)
            {
                _db.BiologicalSignals.Add(new BiologicalSignal
                {
                    NeuronId = n.Id,
                    Intensity = _rng.NextDouble()
                });
                _db.NeuronLogs.Add(new NeuronLog { NeuronId = n.Id, Type = "fired" });
                n.Energy -= energyCost;
            }

            // 2) Chance de evoluir
            if (_rng.NextDouble() < evolveChance)
            {
                n.Status = "evolving";
                _db.BiologicalEvents.Add(new BiologicalEvent { NeuronId = n.Id, Kind = "evolution" });
                _db.NeuronLogs.Add(new NeuronLog { NeuronId = n.Id, Type = "evolved" });
            }

            // 3) Chance de morrer (ou morte por energia esgotada)
            bool randomDeath = _rng.NextDouble() < deathChance;
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
        Console.WriteLine($" [TICK CONFIG] Neurons={neurons.Count} Fire={fireChance:P2} | Evolve={evolveChance:P2} | Death={deathChance:P2} | EnergyCost={energyCost:F2} | EnergyRegen={energyRegen:F2}");
        await _db.SaveChangesAsync();   // grava TUDO de uma vez (uma transação)
    }

    // Valor efetivo do parâmetro neste tick.
    private static double Resolve(ConfigParameterDto p) =>
        p.Pinned ? p.Value : p.Min + _rng.NextDouble() * (p.Max - p.Min);
}
