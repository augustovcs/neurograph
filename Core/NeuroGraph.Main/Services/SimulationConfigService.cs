using Microsoft.EntityFrameworkCore;
using NeuroGraph.Main.Data;
using NeuroGraph.Main.Dtos;
using NeuroGraph.Main.Entities;
using NeuroGraph.Main.Interfaces;

namespace NeuroGraph.Main.Services;

public class SimulationConfigService : ISimulationConfigService
{
    private readonly AppDbContext _db;

    public SimulationConfigService(AppDbContext db) => _db = db;

    public async Task<SimulationConfigDto> GetConfigAsync()
        => ToDto(await GetOrCreateAsync());

    // Substitui TODOS os parâmetros (usado pelo PUT da tela de configurações).
    public async Task<SimulationConfigDto> UpdateConfigAsync(SimulationConfigDto dto)
    {
        var config = await GetOrCreateAsync();

        Apply(config.FireChancePerTick, dto.FireChancePerTick);
        Apply(config.EvolveChancePerTick, dto.EvolveChancePerTick);
        Apply(config.DeathChancePerTick, dto.DeathChancePerTick);
        Apply(config.EnergyCostPerFire, dto.EnergyCostPerFire);
        Apply(config.EnergyRegenPerTick, dto.EnergyRegenPerTick);

        config.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return ToDto(config);
    }

    // Ajusta um único parâmetro (identificado por key).
    public async Task<SimulationConfigDto> AdjustSimulationConfig(string key, ConfigParameterDto value)
    {
        var config = await GetOrCreateAsync();

        var target = Resolve(config, key)
            ?? throw new ArgumentException($"Parâmetro de configuração desconhecido: '{key}'.", nameof(key));

        Apply(target, value);

        config.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return ToDto(config);
    }

    // Linha única de config: pega a existente ou cria com defaults (e persiste).
    private async Task<SimulationConfig> GetOrCreateAsync()
    {
        var config = await _db.SimulationConfigs.FirstOrDefaultAsync();
        if (config is null)
        {
            config = Defaults();
            _db.SimulationConfigs.Add(config);
            await _db.SaveChangesAsync();
        }
        return config;
    }

    //  FIXED METHODS

        // Copia o DTO para o parâmetro, mantendo o valor dentro de [Min, Max].
    private static void Apply(ConfigParameter target, ConfigParameterDto value)
    {
        target.Min = value.Min;
        target.Max = value.Max;
        target.Pinned = value.Pinned;
        target.Value = value.Min <= value.Max
            ? Math.Clamp(value.Value, value.Min, value.Max)
            : value.Value;
    }


    private static SimulationConfig Defaults() => new()
    {
        FireChancePerTick = new ConfigParameter { Value = 0.05, Pinned = false, Min = 0, Max = 0.5 },
        EvolveChancePerTick = new ConfigParameter { Value = 0.01, Pinned = false, Min = 0, Max = 0.2 },
        DeathChancePerTick = new ConfigParameter { Value = 0.005, Pinned = false, Min = 0, Max = 0.1 },
        EnergyCostPerFire = new ConfigParameter { Value = 1.0, Pinned = false, Min = 0, Max = 5 },
        EnergyRegenPerTick = new ConfigParameter { Value = 0.2, Pinned = false, Min = 0, Max = 2 },
    };

    // Resolve o parâmetro pelo nome (case-insensitive), ex.: "fireChancePerTick".
    private static ConfigParameter? Resolve(SimulationConfig c, string key) =>
        key?.Trim().ToLowerInvariant() switch
        {
            "firechancepertick" => c.FireChancePerTick,
            "evolvechancepertick" => c.EvolveChancePerTick,
            "deathchancepertick" => c.DeathChancePerTick,
            "energycostperfire" => c.EnergyCostPerFire,
            "energyregenpertick" => c.EnergyRegenPerTick,
            _ => null,
        };

    private static SimulationConfigDto ToDto(SimulationConfig c) => new(
        ToParam(c.FireChancePerTick),
        ToParam(c.EvolveChancePerTick),
        ToParam(c.DeathChancePerTick),
        ToParam(c.EnergyCostPerFire),
        ToParam(c.EnergyRegenPerTick));

    private static ConfigParameterDto ToParam(ConfigParameter p) =>
        new(p.Value, p.Pinned, p.Min, p.Max);
}
